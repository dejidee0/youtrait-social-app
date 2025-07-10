'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, TrendingUp, Users } from 'lucide-react'

export function TraitBubble({ 
  trait, 
  onUpvote, 
  onClick, 
  interactive = true, 
  size = 'md',
  transparent = false 
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isUpvoting, setIsUpvoting] = useState(false)

  const handleUpvote = async (e) => {
    e.stopPropagation()
    if (!interactive || isUpvoting) return
    
    setIsUpvoting(true)
    try {
      await onUpvote?.(trait.id)
    } finally {
      setIsUpvoting(false)
    }
  }

  const handleClick = () => {
    if (interactive && onClick) {
      onClick(trait)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      mind: 'from-blue-500 to-cyan-500',
      heart: 'from-pink-500 to-red-500',
      social: 'from-green-500 to-emerald-500',
      general: 'from-purple-500 to-indigo-500'
    }
    return colors[category] || colors.general
  }

  const getSizeClasses = (size) => {
    const sizes = {
      sm: 'w-16 h-16 text-xs',
      md: 'w-20 h-20 text-sm',
      lg: 'w-24 h-24 text-base',
      xl: 'w-32 h-32 text-lg'
    }
    return sizes[size] || sizes.md
  }

  const getUpvoteScale = (upvotes) => {
    return Math.min(1.5, 1 + (upvotes * 0.02))
  }

  return (
    <motion.div
      className={`relative ${getSizeClasses(size)} ${interactive ? 'cursor-pointer' : ''}`}
      style={{ 
        transform: `scale(${getUpvoteScale(trait.upvotes || 0)})`,
      }}
      whileHover={interactive ? { scale: getUpvoteScale(trait.upvotes || 0) * 1.1 } : {}}
      whileTap={interactive ? { scale: getUpvoteScale(trait.upvotes || 0) * 0.95 } : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Main bubble */}
      <motion.div
        className={`
          w-full h-full rounded-full flex flex-col items-center justify-center
          bg-gradient-to-r ${getCategoryColor(trait.category)}
          ${transparent ? 'bg-opacity-70 backdrop-blur-sm border border-white/20' : 'shadow-lg'}
          ${interactive ? 'hover:shadow-xl transition-all duration-300' : ''}
          relative overflow-hidden
        `}
        animate={isHovered && interactive ? {
          boxShadow: [
            '0 0 20px rgba(139, 92, 246, 0.3)',
            '0 0 30px rgba(139, 92, 246, 0.5)',
            '0 0 20px rgba(139, 92, 246, 0.3)'
          ]
        } : {}}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
      >
        {/* Background pattern for transparency */}
        {transparent && (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-2 w-3 h-3 border border-white/30 rounded-full" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border border-white/20 rounded-full" />
          </div>
        )}

        {/* Trait word */}
        <motion.div
          className="text-white font-bold text-center leading-tight px-2"
          animate={isHovered ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          {trait.word}
        </motion.div>

        {/* Upvote count - centered */}
        <motion.div
          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-full px-2 py-0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Heart className="w-3 h-3 text-white" />
          <span className="text-white text-xs font-medium">
            {trait.upvotes || 0}
          </span>
        </motion.div>

        {/* Hover overlay */}
        {isHovered && interactive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/10 rounded-full flex items-center justify-center"
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </motion.div>

      {/* Upvote button */}
      {interactive && (
        <motion.button
          className="absolute -top-2 -right-2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleUpvote}
          disabled={isUpvoting}
        >
          {isUpvoting ? (
            <div className="w-3 h-3 border border-gray-300 border-t-purple-500 rounded-full animate-spin" />
          ) : (
            <Heart className="w-3 h-3 text-purple-500" />
          )}
        </motion.button>
      )}

      {/* Floating particles */}
      {isHovered && interactive && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: (Math.random() - 0.5) * 60,
                y: (Math.random() - 0.5) * 60
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.3
              }}
              style={{
                left: '50%',
                top: '50%'
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  )
}