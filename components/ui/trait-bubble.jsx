'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Heart, ThumbsUp, Sparkles } from 'lucide-react'

export function TraitBubble({ 
  trait, 
  size = 'md', 
  interactive = true,
  onClick,
  onUpvote,
  className 
}) {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    xl: 'text-lg px-8 py-4'
  }

  const getSize = () => {
    const baseSize = 60
    const upvoteMultiplier = Math.min(trait.upvotes * 2, 40)
    return baseSize + upvoteMultiplier
  }

  const getBubbleColor = () => {
    const colors = {
      mind: 'from-blue-500 to-cyan-500',
      heart: 'from-pink-500 to-red-500',
      social: 'from-green-500 to-emerald-500',
      general: 'from-purple-500 to-indigo-500'
    }
    return colors[trait.category] || colors.general
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={interactive ? { 
        scale: 1.1, 
        rotate: [0, -5, 5, 0],
        transition: { duration: 0.3 }
      } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
      className={cn(
        'relative group cursor-pointer',
        className
      )}
      style={{
        width: `${getSize()}px`,
        height: `${getSize()}px`
      }}
      onClick={onClick}
    >
      {/* Glow effect */}
      <div 
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r opacity-20 blur-lg transition-all duration-300',
          'group-hover:opacity-40 group-hover:blur-xl',
          getBubbleColor()
        )}
      />
      
      {/* Main bubble */}
      <div 
        className={cn(
          'relative w-full h-full rounded-full bg-gradient-to-r flex items-center justify-center',
          'border border-white/20 backdrop-blur-sm',
          'shadow-lg shadow-black/20',
          getBubbleColor()
        )}
      >
        {/* Trait text */}
        <span className="text-white font-semibold text-center px-2 leading-tight">
          {trait.word}
        </span>
        
        {/* Upvote count */}
        {trait.upvotes > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-white/90 text-gray-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
          >
            {trait.upvotes}
          </motion.div>
        )}
        
        {/* Sparkle effect for high upvotes */}
        {trait.upvotes > 10 && (
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-1 -left-1"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>
        )}
      </div>
      
      {/* Hover actions */}
      {interactive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1"
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUpvote?.(trait.id)
            }}
            className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              // Handle reaction
            }}
            className="bg-white/90 hover:bg-white text-gray-800 rounded-full p-1.5 shadow-lg transition-all duration-200 hover:scale-110"
          >
            <Heart className="w-3 h-3" />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}