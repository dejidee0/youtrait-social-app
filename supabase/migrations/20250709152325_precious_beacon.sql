/*
  # Complete YouTraIT Database Schema - Phase 1

  1. New Tables
    - `profiles` - User profiles with avatar, bio, location, social links
    - `traits` - Individual trait words with categories and metadata
    - `endorsements` - Trait endorsements between users with approval status
    - `notifications` - In-app notification system
    - `besties` - Friend/bestie relationship system
    - `trait_reactions` - Emoji reactions to traits
    - `user_stats` - Cached user statistics

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for authenticated users
    - Secure data access patterns

  3. Functions
    - Auto-update user stats on trait changes
    - Notification triggers
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  bio text,
  location text,
  website text,
  twitter text,
  instagram text,
  linkedin text,
  bestie_id uuid REFERENCES auth.users(id),
  trait_cap integer DEFAULT 50,
  is_premium boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Traits table
CREATE TABLE IF NOT EXISTS traits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL,
  category text DEFAULT 'general',
  color text DEFAULT '#8B5CF6',
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  target_user uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  is_self boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz
);

-- Endorsements table (for tracking who endorsed what)
CREATE TABLE IF NOT EXISTS endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  UNIQUE(sender_id, receiver_id, trait_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('trait_received', 'trait_approved', 'bestie_request', 'bestie_accepted', 'trait_upvoted')),
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Besties table (friend system)
CREATE TABLE IF NOT EXISTS besties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bestie_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz,
  UNIQUE(user_id, bestie_id)
);

-- Trait reactions table
CREATE TABLE IF NOT EXISTS trait_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trait_id, user_id, emoji)
);

-- User stats table (cached statistics)
CREATE TABLE IF NOT EXISTS user_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_traits integer DEFAULT 0,
  approved_traits integer DEFAULT 0,
  pending_traits integer DEFAULT 0,
  total_upvotes integer DEFAULT 0,
  traits_given integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE traits ENABLE ROW LEVEL SECURITY;
ALTER TABLE endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE besties ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Traits policies
CREATE POLICY "Approved traits are viewable by everyone"
  ON traits FOR SELECT
  USING (status = 'approved' OR created_by = auth.uid() OR target_user = auth.uid());

CREATE POLICY "Users can create traits"
  ON traits FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Target users can update trait status"
  ON traits FOR UPDATE
  USING (auth.uid() = target_user OR auth.uid() = created_by);

-- Endorsements policies
CREATE POLICY "Users can view their endorsements"
  ON endorsements FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create endorsements"
  ON endorsements FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can update endorsement status"
  ON endorsements FOR UPDATE
  USING (auth.uid() = receiver_id);

-- Notifications policies
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Besties policies
CREATE POLICY "Users can view their bestie relationships"
  ON besties FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = bestie_id);

CREATE POLICY "Users can create bestie requests"
  ON besties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update bestie status"
  ON besties FOR UPDATE
  USING (auth.uid() = bestie_id);

-- Trait reactions policies
CREATE POLICY "Users can view trait reactions"
  ON trait_reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create reactions"
  ON trait_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their reactions"
  ON trait_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- User stats policies
CREATE POLICY "Users can view their stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Stats can be updated by system"
  ON user_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Stats can be updated by system"
  ON user_stats FOR UPDATE
  USING (true);

-- Functions and triggers
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update stats when traits change
  INSERT INTO user_stats (user_id, total_traits, approved_traits, pending_traits)
  SELECT 
    NEW.target_user,
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'pending')
  FROM traits 
  WHERE target_user = NEW.target_user
  ON CONFLICT (user_id) DO UPDATE SET
    total_traits = EXCLUDED.total_traits,
    approved_traits = EXCLUDED.approved_traits,
    pending_traits = EXCLUDED.pending_traits,
    updated_at = now();
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_trait_change
  AFTER INSERT OR UPDATE ON traits
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Create notification function
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger for trait notifications
CREATE OR REPLACE FUNCTION notify_trait_received()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND OLD.status IS DISTINCT FROM 'pending' THEN
    PERFORM create_notification(
      NEW.target_user,
      'trait_received',
      'New Trait Received!',
      'Someone thinks you are ' || NEW.word || '!',
      jsonb_build_object('trait_id', NEW.id, 'word', NEW.word)
    );
  END IF;
  
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    PERFORM create_notification(
      NEW.created_by,
      'trait_approved',
      'Trait Approved!',
      'Your trait "' || NEW.word || '" was approved!',
      jsonb_build_object('trait_id', NEW.id, 'word', NEW.word)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trait_notification_trigger
  AFTER INSERT OR UPDATE ON traits
  FOR EACH ROW
  EXECUTE FUNCTION notify_trait_received();