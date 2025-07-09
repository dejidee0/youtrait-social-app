'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlowButton } from '@/components/ui/glow-button'
import { Check, X, User, Clock, Heart } from 'lucide-react'

// Mock data for demonstration
const mockEndorsements = [
  {
    id: 1,
    sender: {
      username: 'sarah_chen',
      full_name: 'Sarah Chen',
      avatar_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    trait: {
      word: 'Creative',
      category: 'mind',
      color: '#8B5CF6'
    },
    message: 'You always come up with the most innovative solutions!',
    created_at: '2025-01-09T10:30:00Z'
  },
  {
    id: 2,
    sender: {
      username: 'mike_j',
      full_name: 'Mike Johnson',
      avatar_url: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    trait: {
      word: 'Funny',
      category: 'social',
      color: '#10B981'
    },
    message: 'Your jokes always make my day better 😄',
    created_at: '2025-01-09T09:15:00Z'
  },
  {
    id: 3,
    sender: {
      username: 'emma_r',
      full_name: 'Emma Rodriguez',
      avatar_url: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    trait: {
      word: 'Supportive',
      category: 'heart',
      color: '#EF4444'
    },
    message: 'You were there for me when I needed it most',
    created_at: '2025-01-09T08:45:00Z'
  }
]

export function TraitApprovalInbox() {
  const [endorsements, setEndorsements] = useState(mockEndorsements)
  const [loading, setLoading] = useState(false)

  const handleApprove = async (endorsementId) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEndorsements(prev => prev.filter(e => e.id !== endorsementId))
      
      // Show success message or update UI
      console.log('Endorsed approved:', endorsementId)
    } catch (error) {
      console.error('Error approving endorsement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async (endorsementId) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEndorsements(prev => prev.filter(e => e.id !== endorsementId))
      
      console.log('Endorsement rejected:', endorsementId)
    } catch (error) {
      console.error('Error rejecting endorsement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
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

  if (endorsements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-purple-500/30"
        >
          <Heart className="w-12 h-12 text-purple-400" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
        <p className="text-gray-400 max-w-md">
          No pending trait endorsements. When friends endorse you with new traits, they'll appear here for your approval.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {endorsements.map((endorsement, index) => (
          <motion.div
            key={endorsement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              {/* Sender avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0"
              >
                <img
                  src={endorsement.sender.avatar_url}
                  alt={endorsement.sender.full_name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                />
              </motion.div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-white">
                    {endorsement.sender.full_name}
                  </span>
                  <span className="text-gray-400 text-sm">
                    @{endorsement.sender.username}
                  </span>
                  <span className="text-gray-500 text-sm">•</span>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Clock className="w-3 h-3" />
                    {getTimeAgo(endorsement.created_at)}
                  </div>
                </div>

                <div className="mb-3">
                  <span className="text-gray-300">thinks you are </span>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-white font-semibold bg-gradient-to-r ${getCategoryColor(endorsement.trait.category)} shadow-lg`}
                  >
                    {endorsement.trait.word}
                  </motion.span>
                </div>

                {endorsement.message && (
                  <div className="bg-gray-600/30 rounded-xl p-3 mb-4 border-l-4 border-purple-500">
                    <p className="text-gray-300 italic">"{endorsement.message}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <GlowButton
                    size="sm"
                    onClick={() => handleApprove(endorsement.id)}
                    disabled={loading}
                    className="group"
                  >
                    <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Approve
                  </GlowButton>
                  
                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(endorsement.id)}
                    disabled={loading}
                    className="group hover:border-red-500 hover:text-red-400"
                  >
                    <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Reject
                  </GlowButton>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Bulk actions */}
      {endorsements.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-4 pt-6 border-t border-gray-700"
        >
          <GlowButton
            variant="outline"
            onClick={() => {
              // Approve all
              endorsements.forEach(e => handleApprove(e.id))
            }}
            disabled={loading}
          >
            <Check className="w-4 h-4" />
            Approve All
          </GlowButton>
          
          <GlowButton
            variant="ghost"
            onClick={() => {
              // Reject all
              endorsements.forEach(e => handleReject(e.id))
            }}
            disabled={loading}
            className="hover:text-red-400"
          >
            <X className="w-4 h-4" />
            Reject All
          </GlowButton>
        </motion.div>
      )}
    </div>
  )
}