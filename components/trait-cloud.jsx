'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TraitBubble } from '@/components/ui/trait-bubble'
import { GlowButton } from '@/components/ui/glow-button'
import { Plus, Search, Filter } from 'lucide-react'

export function TraitCloud({ traits = [] }) {
  const [filteredTraits, setFilteredTraits] = useState(traits)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    let filtered = traits

    if (searchTerm) {
      filtered = filtered.filter(trait => 
        trait.word.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(trait => trait.category === selectedCategory)
    }

    setFilteredTraits(filtered)
  }, [traits, searchTerm, selectedCategory])

  const categories = ['all', 'mind', 'heart', 'social', 'general']

  const handleUpvote = async (traitId) => {
    // Handle upvote logic
    console.log('Upvoting trait:', traitId)
  }

  const getCloudLayout = () => {
    return filteredTraits.map((trait, index) => {
      const angle = (index * 137.5) * (Math.PI / 180) // Golden angle
      const radius = 50 + (index * 15)
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius

      return {
        ...trait,
        x,
        y
      }
    })
  }

  const layoutTraits = getCloudLayout()

  if (traits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-purple-500/30"
        >
          <Plus className="w-12 h-12 text-purple-400" />
        </motion.div>
        
        <h3 className="text-xl font-semibold text-white mb-2">No traits yet</h3>
        <p className="text-gray-400 mb-6 max-w-md">
          Your trait cloud is empty. Ask your friends to endorse you with traits that represent who you are!
        </p>
        
        <GlowButton>
          <Plus className="w-4 h-4" />
          Invite Friends
        </GlowButton>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Search traits..."
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Trait Cloud */}
      <div className="relative min-h-[400px] bg-gray-700/20 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Central avatar/user */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 z-10"
          >
            <span className="text-white font-bold">You</span>
          </motion.div>

          {/* Trait bubbles */}
          {layoutTraits.map((trait, index) => (
            <motion.div
              key={trait.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: [trait.x, trait.x + 5, trait.x],
                y: [trait.y, trait.y - 5, trait.y]
              }}
              transition={{ 
                delay: index * 0.1,
                x: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }
              }}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(${trait.x}px, ${trait.y}px)`
              }}
            >
              <TraitBubble 
                trait={trait}
                onUpvote={handleUpvote}
                onClick={() => console.log('Trait clicked:', trait)}
              />
            </motion.div>
          ))}

          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        {/* Stats overlay */}
        <div className="absolute top-4 left-4 bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-600">
          <div className="text-sm text-gray-300">
            <div className="font-semibold text-white">{filteredTraits.length} Traits</div>
            <div>{filteredTraits.reduce((sum, t) => sum + t.upvotes, 0)} Total Upvotes</div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-gray-600">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
              <span>Mind</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
              <span>Heart</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              <span>Social</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <GlowButton variant="outline">
          Share Cloud
        </GlowButton>
        <GlowButton>
          <Plus className="w-4 h-4" />
          Request Trait
        </GlowButton>
      </div>
    </div>
  )
}