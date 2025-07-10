'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { GlowButton } from '@/components/ui/glow-button'
import { Play, Heart, Share2, Eye, Plus, Music, Palette } from 'lucide-react'

const STORY_BACKGROUNDS = [
  { id: 'gradient', name: 'Gradient', style: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'sunset', name: 'Sunset', style: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { id: 'ocean', name: 'Ocean', style: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 'forest', name: 'Forest', style: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' },
  { id: 'cosmic', name: 'Cosmic', style: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' }
]

export function TraitStories() {
  const [stories, setStories] = useState([])
  const [currentStory, setCurrentStory] = useState(null)
  const [showCreator, setShowCreator] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('trait_stories')
        .select(`
          *,
          trait:traits(word, category),
          user:profiles!trait_stories_user_id_fkey(username, full_name, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error('Error loading stories:', error)
    } finally {
      setLoading(false)
    }
  }

  const playStory = (story) => {
    setCurrentStory(story)
    // Increment view count
    incrementViewCount(story.id)
  }

  const incrementViewCount = async (storyId) => {
    try {
      await supabase
        .from('story_interactions')
        .insert({
          story_id: storyId,
          user_id: user?.id,
          interaction_type: 'view'
        })

      // Update local count
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, view_count: story.view_count + 1 }
          : story
      ))
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const likeStory = async (storyId) => {
    try {
      await supabase
        .from('story_interactions')
        .insert({
          story_id: storyId,
          user_id: user?.id,
          interaction_type: 'like'
        })

      // Update local count
      setStories(prev => prev.map(story => 
        story.id === storyId 
          ? { ...story, like_count: story.like_count + 1 }
          : story
      ))
    } catch (error) {
      console.error('Error liking story:', error)
    }
  }

  const shareStory = async (story) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${story.user.full_name}'s "${story.trait.word}" Story`,
          text: `Check out this amazing trait story!`,
          url: window.location.href
        })
        
        // Increment share count
        await supabase
          .from('story_interactions')
          .insert({
            story_id: story.id,
            user_id: user?.id,
            interaction_type: 'share'
          })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Trait Stories</h2>
          <p className="text-gray-400">Short-form trait expressions from the community</p>
        </div>
        
        <GlowButton onClick={() => setShowCreator(true)}>
          <Plus className="w-4 h-4" />
          Create Story
        </GlowButton>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => playStory(story)}
            className="relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer group"
            style={{ background: story.background_style }}
          >
            {/* Story Content */}
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              {/* User Info */}
              <div className="flex items-center gap-2">
                <img
                  src={story.user.avatar_url}
                  alt={story.user.full_name}
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                />
                <span className="text-white text-sm font-medium">
                  {story.user.username}
                </span>
              </div>

              {/* Trait */}
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
                >
                  {story.trait.word}
                </motion.div>
                <div className="text-white/80 text-sm">
                  {story.trait.category}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-white/80 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {story.view_count}
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {story.like_count}
                </div>
              </div>
            </div>

            {/* Play Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Play className="w-6 h-6 text-white ml-1" />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Player Modal */}
      <AnimatePresence>
        {currentStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setCurrentStory(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden"
              style={{ background: currentStory.background_style }}
            >
              {/* Story Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentStory.user.avatar_url}
                      alt={currentStory.user.full_name}
                      className="w-10 h-10 rounded-full border-2 border-white/50"
                    />
                    <div>
                      <div className="text-white font-semibold">
                        {currentStory.user.full_name}
                      </div>
                      <div className="text-white/70 text-sm">
                        @{currentStory.user.username}
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setCurrentStory(null)}
                    className="text-white/70 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Trait */}
                <div className="text-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-6xl font-bold text-white mb-4 drop-shadow-2xl"
                  >
                    {currentStory.trait.word}
                  </motion.div>
                  <div className="text-white/90 text-lg">
                    {currentStory.trait.category} trait
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => likeStory(currentStory.id)}
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Heart className="w-6 h-6" />
                    <span className="text-xs">{currentStory.like_count}</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => shareStory(currentStory)}
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Share2 className="w-6 h-6" />
                    <span className="text-xs">Share</span>
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1 text-white/80 hover:text-white"
                  >
                    <Eye className="w-6 h-6" />
                    <span className="text-xs">{currentStory.view_count}</span>
                  </motion.button>
                </div>
              </div>

              {/* Animated Elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  animate={{
                    x: [0, Math.random() * 300 - 150],
                    y: [0, Math.random() * 500 - 250],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <StoryCreator 
            onClose={() => setShowCreator(false)}
            onCreated={loadStories}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Story Creator Component
function StoryCreator({ onClose, onCreated }) {
  const [selectedTrait, setSelectedTrait] = useState(null)
  const [selectedBackground, setSelectedBackground] = useState(STORY_BACKGROUNDS[0])
  const [userTraits, setUserTraits] = useState([])
  const [creating, setCreating] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    loadUserTraits()
  }, [])

  const loadUserTraits = async () => {
    try {
      const { data } = await supabase
        .from('traits')
        .select('*')
        .eq('target_user', user.id)
        .eq('status', 'approved')

      setUserTraits(data || [])
    } catch (error) {
      console.error('Error loading traits:', error)
    }
  }

  const createStory = async () => {
    if (!selectedTrait) return

    setCreating(true)
    try {
      const { error } = await supabase
        .from('trait_stories')
        .insert({
          user_id: user.id,
          trait_id: selectedTrait.id,
          background_style: selectedBackground.style,
          story_type: 'reel'
        })

      if (!error) {
        onCreated()
        onClose()
      }
    } catch (error) {
      console.error('Error creating story:', error)
    } finally {
      setCreating(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-700 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <h3 className="text-xl font-bold text-white mb-6">Create Trait Story</h3>

        {/* Trait Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Choose a trait
          </label>
          <div className="grid grid-cols-2 gap-2">
            {userTraits.map((trait) => (
              <motion.button
                key={trait.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedTrait(trait)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedTrait?.id === trait.id
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="text-white font-medium">{trait.word}</div>
                <div className="text-gray-400 text-xs">{trait.upvotes} upvotes</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Background Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Choose background
          </label>
          <div className="grid grid-cols-3 gap-2">
            {STORY_BACKGROUNDS.map((bg) => (
              <motion.button
                key={bg.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBackground(bg)}
                className={`aspect-square rounded-xl border-2 transition-all ${
                  selectedBackground.id === bg.id
                    ? 'border-purple-500'
                    : 'border-gray-600'
                }`}
                style={{ background: bg.style }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">{bg.name}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {selectedTrait && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Preview
            </label>
            <div 
              className="aspect-[9/16] max-w-32 mx-auto rounded-xl overflow-hidden"
              style={{ background: selectedBackground.style }}
            >
              <div className="h-full p-3 flex flex-col justify-center items-center">
                <div className="text-white font-bold text-lg text-center">
                  {selectedTrait.word}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <GlowButton
            onClick={createStory}
            disabled={!selectedTrait || creating}
            className="flex-1"
          >
            {creating ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {creating ? 'Creating...' : 'Create Story'}
          </GlowButton>
          
          <GlowButton
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </GlowButton>
        </div>
      </motion.div>
    </motion.div>
  )
}