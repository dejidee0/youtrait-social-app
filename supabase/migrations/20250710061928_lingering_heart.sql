/*
  # YouTraIT Phase 2 - Realtime Social Features

  1. New Tables
    - `trait_reactions` - Enhanced emoji reactions system
    - `trait_cards` - Generated shareable cards
    - `bestie_requests` - Friend nomination system
    - `user_settings` - Premium features and preferences
    
  2. Enhanced Features
    - Real-time subscriptions
    - Trait reaction animations
    - Bestie mutual trait display
    - Premium trait caps
    
  3. Functions
    - Real-time notification triggers
    - Trait card generation
    - Bestie matching algorithm
*/

-- Enhanced trait reactions with animation data
CREATE TABLE IF NOT EXISTS trait_reactions_enhanced (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji text NOT NULL,
  animation_type text DEFAULT 'float',
  position_x float DEFAULT 0,
  position_y float DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trait_id, user_id, emoji)
);

-- Trait cards for sharing
CREATE TABLE IF NOT EXISTS trait_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  card_style text DEFAULT 'default',
  background_color text DEFAULT '#8B5CF6',
  animation_type text DEFAULT 'glow',
  share_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enhanced bestie system
CREATE TABLE IF NOT EXISTS bestie_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  requested_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  message text,
  created_at timestamptz DEFAULT now(),
  responded_at timestamptz,
  UNIQUE(requester_id, requested_id)
);

-- User settings and premium features
CREATE TABLE IF NOT EXISTS user_settings (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_premium boolean DEFAULT false,
  trait_cap integer DEFAULT 50,
  notification_preferences jsonb DEFAULT '{"trait_received": true, "trait_approved": true, "bestie_request": true}',
  privacy_settings jsonb DEFAULT '{"profile_public": true, "traits_public": true}',
  theme_preferences jsonb DEFAULT '{"primary_color": "#8B5CF6", "animation_speed": "normal"}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Mutual traits view for besties
CREATE OR REPLACE VIEW mutual_traits AS
SELECT DISTINCT
  b.requester_id as user1_id,
  b.requested_id as user2_id,
  t1.word,
  t1.category,
  t1.upvotes as user1_upvotes,
  t2.upvotes as user2_upvotes
FROM bestie_requests b
JOIN traits t1 ON t1.target_user = b.requester_id AND t1.status = 'approved'
JOIN traits t2 ON t2.target_user = b.requested_id AND t2.status = 'approved'
WHERE b.status = 'accepted' 
  AND t1.word = t2.word;

-- Enable RLS
ALTER TABLE trait_reactions_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE bestie_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view trait reactions" ON trait_reactions_enhanced FOR SELECT USING (true);
CREATE POLICY "Users can create reactions" ON trait_reactions_enhanced FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their reactions" ON trait_reactions_enhanced FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view trait cards" ON trait_cards FOR SELECT USING (true);
CREATE POLICY "Users can create their trait cards" ON trait_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their trait cards" ON trait_cards FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view bestie requests" ON bestie_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = requested_id);
CREATE POLICY "Users can create bestie requests" ON bestie_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can respond to bestie requests" ON bestie_requests FOR UPDATE USING (auth.uid() = requested_id);

CREATE POLICY "Users can view their settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Real-time functions
CREATE OR REPLACE FUNCTION broadcast_trait_reaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Broadcast reaction to all subscribers
  PERFORM pg_notify(
    'trait_reaction',
    json_build_object(
      'trait_id', NEW.trait_id,
      'user_id', NEW.user_id,
      'emoji', NEW.emoji,
      'animation_type', NEW.animation_type,
      'position_x', NEW.position_x,
      'position_y', NEW.position_y
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trait_reaction_broadcast
  AFTER INSERT ON trait_reactions_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION broadcast_trait_reaction();

-- Function to get mutual traits for besties
CREATE OR REPLACE FUNCTION get_mutual_traits(user1_id uuid, user2_id uuid)
RETURNS TABLE(
  word text,
  category text,
  user1_upvotes integer,
  user2_upvotes integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    t1.word,
    t1.category,
    t1.upvotes,
    t2.upvotes
  FROM traits t1
  JOIN traits t2 ON t1.word = t2.word
  WHERE t1.target_user = user1_id 
    AND t2.target_user = user2_id
    AND t1.status = 'approved'
    AND t2.status = 'approved';
END;
$$ LANGUAGE plpgsql;

-- Function to check trait cap limits
CREATE OR REPLACE FUNCTION check_trait_cap()
RETURNS TRIGGER AS $$
DECLARE
  current_count integer;
  user_cap integer;
BEGIN
  -- Get current trait count for user
  SELECT COUNT(*) INTO current_count
  FROM traits
  WHERE target_user = NEW.target_user AND status = 'approved';
  
  -- Get user's trait cap
  SELECT COALESCE(us.trait_cap, 50) INTO user_cap
  FROM user_settings us
  WHERE us.user_id = NEW.target_user;
  
  -- Check if adding this trait would exceed cap
  IF current_count >= user_cap THEN
    RAISE EXCEPTION 'Trait cap of % reached. Upgrade to premium for more traits.', user_cap;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_trait_cap_trigger
  BEFORE UPDATE OF status ON traits
  FOR EACH ROW
  WHEN (NEW.status = 'approved' AND OLD.status != 'approved')
  EXECUTE FUNCTION check_trait_cap();