/*
  # Phase 3 - AI, Viral Layer & Gamification Features

  1. New Tables
    - `ai_trait_suggestions` - AI-powered trait recommendations
    - `word_battles` - Daily trait challenge system
    - `trait_stories` - Short-form trait content
    - `live_sessions` - Real-time endorsement events
    - `personality_dna` - User personality analysis
    - `premium_features` - Advanced user features
    - `trait_analytics` - Detailed trait statistics

  2. AI & Gamification
    - Smart trait suggestion engine
    - Battle royale leaderboards
    - Story creation system
    - Live session management
    - DNA profile generation

  3. Premium Features
    - Trait skins and customization
    - Advanced analytics
    - Priority features
*/

-- AI Trait Suggestions
CREATE TABLE IF NOT EXISTS ai_trait_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  suggested_trait text NOT NULL,
  confidence_score float DEFAULT 0.0,
  reasoning text,
  source_type text DEFAULT 'bio' CHECK (source_type IN ('bio', 'activity', 'self_traits', 'social_graph')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'used')),
  created_at timestamptz DEFAULT now(),
  used_at timestamptz
);

-- Word Battle Royale System
CREATE TABLE IF NOT EXISTS word_battles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_word text NOT NULL,
  battle_date date DEFAULT CURRENT_DATE,
  description text,
  total_participants integer DEFAULT 0,
  prize_description text,
  status text DEFAULT 'active' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  ends_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Battle Participants & Leaderboard
CREATE TABLE IF NOT EXISTS battle_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id uuid REFERENCES word_battles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  votes_received integer DEFAULT 0,
  rank integer,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(battle_id, user_id)
);

-- Trait Stories/Reels
CREATE TABLE IF NOT EXISTS trait_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  story_type text DEFAULT 'reel' CHECK (story_type IN ('reel', 'story', 'highlight')),
  content_data jsonb DEFAULT '{}', -- music, effects, captions
  background_style text DEFAULT 'gradient',
  animation_type text DEFAULT 'float',
  view_count integer DEFAULT 0,
  like_count integer DEFAULT 0,
  share_count integer DEFAULT 0,
  is_public boolean DEFAULT true,
  expires_at timestamptz DEFAULT (now() + interval '24 hours'),
  created_at timestamptz DEFAULT now()
);

-- Live Trait Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  session_type text DEFAULT 'endorsement' CHECK (session_type IN ('endorsement', 'battle', 'reveal')),
  max_participants integer DEFAULT 50,
  current_participants integer DEFAULT 0,
  status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'ended')),
  scheduled_for timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  session_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Live Session Participants
CREATE TABLE IF NOT EXISTS live_session_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES live_sessions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'participant' CHECK (role IN ('host', 'participant', 'viewer')),
  joined_at timestamptz DEFAULT now(),
  left_at timestamptz,
  UNIQUE(session_id, user_id)
);

-- Personality DNA Profiles
CREATE TABLE IF NOT EXISTS personality_dna (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mind_score float DEFAULT 0.0,
  heart_score float DEFAULT 0.0,
  social_score float DEFAULT 0.0,
  creativity_score float DEFAULT 0.0,
  leadership_score float DEFAULT 0.0,
  empathy_score float DEFAULT 0.0,
  humor_score float DEFAULT 0.0,
  intelligence_score float DEFAULT 0.0,
  dominant_traits text[] DEFAULT '{}',
  personality_type text,
  last_calculated timestamptz DEFAULT now(),
  calculation_version integer DEFAULT 1
);

-- Premium Features & Customization
CREATE TABLE IF NOT EXISTS premium_features (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_tier text DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
  trait_skins jsonb DEFAULT '{}',
  custom_animations jsonb DEFAULT '{}',
  priority_support boolean DEFAULT false,
  advanced_analytics boolean DEFAULT false,
  custom_themes jsonb DEFAULT '{}',
  subscription_expires timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trait Analytics
CREATE TABLE IF NOT EXISTS trait_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trait_id uuid REFERENCES traits(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  metric_type text NOT NULL CHECK (metric_type IN ('view', 'reaction', 'share', 'comment', 'save')),
  metric_value integer DEFAULT 1,
  source_platform text DEFAULT 'web',
  metadata jsonb DEFAULT '{}',
  recorded_at timestamptz DEFAULT now()
);

-- Story Views & Interactions
CREATE TABLE IF NOT EXISTS story_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES trait_stories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('view', 'like', 'share', 'comment')),
  interaction_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, user_id, interaction_type)
);

-- Enable RLS
ALTER TABLE ai_trait_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE premium_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE trait_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their AI suggestions" ON ai_trait_suggestions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their AI suggestions" ON ai_trait_suggestions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view active battles" ON word_battles FOR SELECT USING (status = 'active');
CREATE POLICY "Users can view battle participants" ON battle_participants FOR SELECT USING (true);
CREATE POLICY "Users can join battles" ON battle_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public stories" ON trait_stories FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can create their stories" ON trait_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their stories" ON trait_stories FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view live sessions" ON live_sessions FOR SELECT USING (true);
CREATE POLICY "Users can create live sessions" ON live_sessions FOR INSERT WITH CHECK (auth.uid() = host_id);
CREATE POLICY "Hosts can update their sessions" ON live_sessions FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Users can view session participants" ON live_session_participants FOR SELECT USING (true);
CREATE POLICY "Users can join sessions" ON live_session_participants FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their DNA profile" ON personality_dna FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their DNA profile" ON personality_dna FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert DNA profiles" ON personality_dna FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their premium features" ON premium_features FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their premium features" ON premium_features FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert premium features" ON premium_features FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view analytics" ON trait_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert analytics" ON trait_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view story interactions" ON story_interactions FOR SELECT USING (true);
CREATE POLICY "Users can create interactions" ON story_interactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for AI and Analytics

-- Calculate Personality DNA
CREATE OR REPLACE FUNCTION calculate_personality_dna(target_user_id uuid)
RETURNS void AS $$
DECLARE
  mind_traits text[] := ARRAY['smart', 'intelligent', 'clever', 'wise', 'analytical', 'logical'];
  heart_traits text[] := ARRAY['kind', 'caring', 'loving', 'empathetic', 'compassionate', 'warm'];
  social_traits text[] := ARRAY['funny', 'outgoing', 'charismatic', 'friendly', 'social', 'energetic'];
  
  mind_count integer := 0;
  heart_count integer := 0;
  social_count integer := 0;
  total_traits integer := 0;
  
  mind_score float := 0.0;
  heart_score float := 0.0;
  social_score float := 0.0;
BEGIN
  -- Count traits in each category
  SELECT COUNT(*) INTO total_traits
  FROM traits 
  WHERE target_user = target_user_id AND status = 'approved';
  
  IF total_traits = 0 THEN
    RETURN;
  END IF;
  
  -- Count mind traits
  SELECT COUNT(*) INTO mind_count
  FROM traits 
  WHERE target_user = target_user_id 
    AND status = 'approved' 
    AND LOWER(word) = ANY(mind_traits);
  
  -- Count heart traits
  SELECT COUNT(*) INTO heart_count
  FROM traits 
  WHERE target_user = target_user_id 
    AND status = 'approved' 
    AND LOWER(word) = ANY(heart_traits);
  
  -- Count social traits
  SELECT COUNT(*) INTO social_count
  FROM traits 
  WHERE target_user = target_user_id 
    AND status = 'approved' 
    AND LOWER(word) = ANY(social_traits);
  
  -- Calculate scores (0-100)
  mind_score := (mind_count::float / total_traits::float) * 100;
  heart_score := (heart_count::float / total_traits::float) * 100;
  social_score := (social_count::float / total_traits::float) * 100;
  
  -- Insert or update DNA profile
  INSERT INTO personality_dna (
    user_id, mind_score, heart_score, social_score, last_calculated
  ) VALUES (
    target_user_id, mind_score, heart_score, social_score, now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    mind_score = EXCLUDED.mind_score,
    heart_score = EXCLUDED.heart_score,
    social_score = EXCLUDED.social_score,
    last_calculated = now();
END;
$$ LANGUAGE plpgsql;

-- Generate AI Trait Suggestions
CREATE OR REPLACE FUNCTION generate_ai_suggestions(target_user_id uuid)
RETURNS void AS $$
DECLARE
  user_bio text;
  existing_traits text[];
  suggestion_pool text[] := ARRAY[
    'creative', 'innovative', 'thoughtful', 'reliable', 'adventurous',
    'passionate', 'determined', 'optimistic', 'genuine', 'inspiring'
  ];
  suggestion text;
BEGIN
  -- Get user bio
  SELECT bio INTO user_bio
  FROM profiles 
  WHERE id = target_user_id;
  
  -- Get existing traits
  SELECT ARRAY_AGG(LOWER(word)) INTO existing_traits
  FROM traits 
  WHERE target_user = target_user_id AND status = 'approved';
  
  -- Generate suggestions (simple version - can be enhanced with real AI)
  FOREACH suggestion IN ARRAY suggestion_pool
  LOOP
    -- Only suggest if user doesn't already have this trait
    IF NOT (LOWER(suggestion) = ANY(COALESCE(existing_traits, ARRAY[]::text[]))) THEN
      INSERT INTO ai_trait_suggestions (
        user_id, suggested_trait, confidence_score, reasoning, source_type
      ) VALUES (
        target_user_id, 
        suggestion, 
        0.7 + (RANDOM() * 0.3), -- Random confidence between 0.7-1.0
        'Based on your profile and activity patterns',
        'bio'
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create Daily Battle
CREATE OR REPLACE FUNCTION create_daily_battle()
RETURNS uuid AS $$
DECLARE
  battle_words text[] := ARRAY[
    'funny', 'creative', 'kind', 'smart', 'loyal', 'energetic',
    'inspiring', 'reliable', 'adventurous', 'passionate'
  ];
  selected_word text;
  battle_id uuid;
BEGIN
  -- Select random word
  selected_word := battle_words[1 + floor(random() * array_length(battle_words, 1))];
  
  -- Create battle
  INSERT INTO word_battles (
    battle_word, 
    description,
    prize_description
  ) VALUES (
    selected_word,
    'Who embodies "' || selected_word || '" the most today?',
    'Winner gets premium features for 1 week!'
  )
  RETURNING id INTO battle_id;
  
  RETURN battle_id;
END;
$$ LANGUAGE plpgsql;

-- Update Battle Rankings
CREATE OR REPLACE FUNCTION update_battle_rankings(battle_id uuid)
RETURNS void AS $$
BEGIN
  -- Update rankings based on votes
  WITH ranked_participants AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY votes_received DESC, joined_at ASC) as new_rank
    FROM battle_participants 
    WHERE battle_id = battle_id
  )
  UPDATE battle_participants bp
  SET rank = rp.new_rank
  FROM ranked_participants rp
  WHERE bp.id = rp.id;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE OR REPLACE FUNCTION trigger_dna_calculation()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate DNA when traits are approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    PERFORM calculate_personality_dna(NEW.target_user);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER dna_calculation_trigger
  AFTER UPDATE ON traits
  FOR EACH ROW
  EXECUTE FUNCTION trigger_dna_calculation();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_trait_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_battle_participants_battle_id ON battle_participants(battle_id);
CREATE INDEX IF NOT EXISTS idx_trait_stories_user_id ON trait_stories(user_id);
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_story_interactions_story_id ON story_interactions(story_id);