'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtime } from '@/lib/realtime'

const REACTION_EMOJIS = ['🔥', '💯', '👑', '❤️', '😍', '🤩', '💪', '🎯']

export function TraitReactions({ traitId, existingReactions = [] }) {
  const [reactions, setReactions] = useState(existingReactions)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  const [floatingReactions, setFloatingReactions] = useState([])
  const { sendReaction } = useRealtime()

  useEffect(() => {
    // Listen for real-time reactions
    const handleReaction = (event) => {
      const { traitId: reactionTraitId, emoji, position } = event.detail
      
      if (reactionTraitId === traitId) {
        // Add floating animation
        const id = Date.now() + Math.random()
        setFloatingReactions(prev => [...prev, {
          id,
          emoji,
          position,
          timestamp: Date.now()
        }])

        // Remove after animation
        setTimeout(() => {
          setFloatingReactions(prev => prev.filter(r => r.id !== id))
        }, 3000)

        // Update reaction count
        setReactions(prev => {
          const existing = prev.find(r => r.emoji === emoji)
          if (existing) {
            return prev.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1 }
                : r
            )
          } else {
            return [...prev, { emoji, count: 1 }]
          }
        })
      }
    }

    window.addEventListener('traitReaction', handleReaction)
    return () => window.removeEventListener('traitReaction', handleReaction)
  }, [traitId])

  const handleReactionClick = async (emoji) => {
    const position = {
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50
    }

    await sendReaction(traitId, emoji, position)
    setShowReactionPicker(false)
  }

  return (
    <div className="relative">
      {/* Existing reactions display */}
      <div className="flex items-center gap-2 mb-2">
        {reactions.map((reaction, index) => (
          <motion.div
            key={reaction.emoji}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 bg-gray-700/50 rounded-full px-2 py-1 text-sm"
          >
            <span>{reaction.emoji}</span>
            <span className="text-gray-300">{reaction.count}</span>
          </motion.div>
        ))}
        
        {/* Add reaction button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="w-8 h-8 bg-gray-700/50 hover:bg-gray-600/50 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          +
        </motion.button>
      </div>

      {/* Reaction picker */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-full left-0 mb-2 bg-gray-800/90 backdrop-blur-sm rounded-xl p-3 border border-gray-600 shadow-xl z-50"
          >
            <div className="grid grid-cols-4 gap-2">
              {REACTION_EMOJIS.map((emoji) => (
                <motion.button
                  key={emoji}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleReactionClick(emoji)}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating reactions */}
      <AnimatePresence>
        {floatingReactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ 
              opacity: 1, 
              scale: 0.5,
              x: reaction.position.x,
              y: reaction.position.y
            }}
            animate={{ 
              opacity: 0, 
              scale: 1.5,
              x: reaction.position.x + (Math.random() * 100 - 50),
              y: reaction.position.y - 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: 'easeOut' }}
            className="absolute pointer-events-none text-2xl z-40"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}