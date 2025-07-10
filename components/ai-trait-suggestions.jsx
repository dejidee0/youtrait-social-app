'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { aiSuggestionEngine } from '@/lib/ai-suggestions'
import { useAuthStore } from '@/lib/store'
import { GlowButton } from '@/components/ui/glow-button'
import { Sparkles, Brain, Check, X, Lightbulb, Zap } from 'lucide-react'

export function AITraitSuggestions() {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      loadSuggestions()
    }
  }, [user])

  const loadSuggestions = async () => {
    try {
      setLoading(true)
      
      // Generate new suggestions
      await aiSuggestionEngine.generateSuggestions(user.id)
      
      // Load suggestions
      const data = await aiSuggestionEngine.getSuggestions(user.id)
      setSuggestions(data)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptSuggestion = async (suggestion) => {
    setProcessingId(suggestion.id)
    
    try {
      await aiSuggestionEngine.acceptSuggestion(suggestion.id)
      
      // Remove from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
      
      // Here you would typically create a trait or add to user's trait list
      console.log('Accepted suggestion:', suggestion.suggested_trait)
    } catch (error) {
      console.error('Error accepting suggestion:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectSuggestion = async (suggestion) => {
    setProcessingId(suggestion.id)
    
    try {
      await aiSuggestionEngine.rejectSuggestion(suggestion.id)
      
      // Remove from list
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id))
    } catch (error) {
      console.error('Error rejecting suggestion:', error)
    } finally {
      setProcessingId(null)
    }
  }

  const getSourceIcon = (sourceType) => {
    switch (sourceType) {
      case 'bio':
        return <Lightbulb className="w-4 h-4 text-yellow-400" />
      case 'activity':
        return <Zap className="w-4 h-4 text-blue-400" />
      case 'social_graph':
        return <Brain className="w-4 h-4 text-purple-400" />
      default:
        return <Sparkles className="w-4 h-4 text-green-400" />
    }
  }

  const getConfidenceColor = (score) => {
    if (score >= 0.8) return 'text-green-400'
    if (score >= 0.6) return 'text-yellow-400'
    return 'text-orange-400'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No AI Suggestions</h3>
        <p className="text-gray-400 mb-4">
          Complete your profile and interact more to get personalized trait suggestions!
        </p>
        <GlowButton onClick={loadSuggestions} size="sm">
          <Sparkles className="w-4 h-4" />
          Generate Suggestions
        </GlowButton>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">AI Trait Suggestions</h3>
          <p className="text-gray-400 text-sm">Powered by your profile and activity</p>
        </div>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getSourceIcon(suggestion.source_type)}
                <div>
                  <motion.h4 
                    className="text-lg font-semibold text-white"
                    whileHover={{ scale: 1.05 }}
                  >
                    {suggestion.suggested_trait}
                  </motion.h4>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Confidence:</span>
                    <span className={`font-medium ${getConfidenceColor(suggestion.confidence_score)}`}>
                      {Math.round(suggestion.confidence_score * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-purple-500/30"
              >
                <Sparkles className="w-6 h-6 text-purple-400" />
              </motion.div>
            </div>

            <div className="bg-gray-700/30 rounded-xl p-4 mb-4 border-l-4 border-purple-500">
              <p className="text-gray-300 text-sm italic">
                "{suggestion.reasoning}"
              </p>
            </div>

            <div className="flex items-center gap-3">
              <GlowButton
                size="sm"
                onClick={() => handleAcceptSuggestion(suggestion)}
                disabled={processingId === suggestion.id}
                className="flex-1 group"
              >
                {processingId === suggestion.id ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 group-hover:scale-110 transition-transform" />
                )}
                Accept
              </GlowButton>
              
              <GlowButton
                variant="outline"
                size="sm"
                onClick={() => handleRejectSuggestion(suggestion)}
                disabled={processingId === suggestion.id}
                className="flex-1 group hover:border-red-500 hover:text-red-400"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Pass
              </GlowButton>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <div className="text-center pt-4">
        <GlowButton
          variant="ghost"
          onClick={loadSuggestions}
          size="sm"
        >
          <Sparkles className="w-4 h-4" />
          Refresh Suggestions
        </GlowButton>
      </div>
    </div>
  )
}