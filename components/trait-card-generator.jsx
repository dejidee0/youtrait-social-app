'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlowButton } from '@/components/ui/glow-button'
import { Download, Share2, Palette, Sparkles, Copy } from 'lucide-react'
import html2canvas from 'html2canvas'

const CARD_STYLES = [
  {
    id: 'gradient',
    name: 'Gradient Glow',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'neon',
    name: 'Neon Vibes',
    background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'sunset',
    name: 'Sunset Dreams',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    textColor: '#4a5568'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'forest',
    name: 'Forest Magic',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    textColor: '#ffffff'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Energy',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff'
  }
]

export function TraitCardGenerator({ trait, user }) {
  const [selectedStyle, setSelectedStyle] = useState(CARD_STYLES[0])
  const [isGenerating, setIsGenerating] = useState(false)
  const [showStylePicker, setShowStylePicker] = useState(false)
  const cardRef = useRef(null)

  const generateCard = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        width: 400,
        height: 600
      })
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${trait.word}-trait-card.png`
        link.click()
        URL.revokeObjectURL(url)
      })
    } catch (error) {
      console.error('Error generating card:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My "${trait.word}" Trait`,
          text: `Check out my personality trait: ${trait.word}!`,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="space-y-6">
      {/* Card Preview */}
      <div className="flex justify-center">
        <motion.div
          ref={cardRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl"
          style={{ background: selectedStyle.background }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/30 rounded-full" />
            <div className="absolute top-12 right-8 w-8 h-8 border border-white/20 rounded-full" />
            <div className="absolute bottom-16 left-8 w-12 h-12 border border-white/25 rounded-full" />
            <div className="absolute bottom-8 right-12 w-6 h-6 border border-white/20 rounded-full" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8">
            {/* Header */}
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8" style={{ color: selectedStyle.textColor }} />
              </motion.div>
              <h3 className="text-sm font-medium opacity-80" style={{ color: selectedStyle.textColor }}>
                Personality Trait
              </h3>
            </div>

            {/* Main Trait */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-4"
              >
                <div 
                  className="text-4xl font-bold mb-2"
                  style={{ color: selectedStyle.textColor }}
                >
                  {trait.word}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: i < Math.min(trait.upvotes / 2, 5) ? 1 : 0.3 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="w-3 h-3 rounded-full bg-current mx-0.5"
                        style={{ color: selectedStyle.textColor }}
                      />
                    ))}
                  </div>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: selectedStyle.textColor }}
                  >
                    {trait.upvotes} upvotes
                  </span>
                </div>
              </motion.div>

              {/* Category Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm"
              >
                <span 
                  className="text-sm font-medium"
                  style={{ color: selectedStyle.textColor }}
                >
                  {trait.category}
                </span>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30" />
                )}
                <span 
                  className="text-sm font-medium"
                  style={{ color: selectedStyle.textColor }}
                >
                  {user?.full_name || 'Anonymous'}
                </span>
              </div>
              <div 
                className="text-xs opacity-60"
                style={{ color: selectedStyle.textColor }}
              >
                YouTraIT.com
              </div>
            </div>
          </div>

          {/* Animated Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Style Picker */}
      <div className="text-center">
        <GlowButton
          variant="outline"
          onClick={() => setShowStylePicker(!showStylePicker)}
          className="mb-4"
        >
          <Palette className="w-4 h-4" />
          Change Style
        </GlowButton>

        <AnimatePresence>
          {showStylePicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6"
            >
              {CARD_STYLES.map((style) => (
                <motion.button
                  key={style.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStyle(style)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedStyle.id === style.id
                      ? 'border-purple-500 shadow-lg shadow-purple-500/25'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ background: style.background }}
                >
                  <div className="text-white text-sm font-medium">
                    {style.name}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <GlowButton
          onClick={generateCard}
          disabled={isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isGenerating ? 'Generating...' : 'Download Card'}
        </GlowButton>

        <GlowButton
          variant="outline"
          onClick={shareCard}
          className="flex items-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share
        </GlowButton>
      </div>
    </div>
  )
}