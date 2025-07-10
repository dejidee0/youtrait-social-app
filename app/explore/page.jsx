'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Users, Heart, Crown } from 'lucide-react'
import { TraitBubble } from '@/components/ui/trait-bubble'
import { GlowButton } from '@/components/ui/glow-button'

// Mock data for exploration
const trendingTraits = [
  { id: 1, word: 'Creative', upvotes: 245, category: 'mind', users: 89 },
  { id: 2, word: 'Kind', upvotes: 312, category: 'heart', users: 156 },
  { id: 3, word: 'Funny', upvotes: 198, category: 'social', users: 78 },
  { id: 4, word: 'Smart', upvotes: 167, category: 'mind', users: 92 },
  { id: 5, word: 'Loyal', upvotes: 234, category: 'heart', users: 134 },
  { id: 6, word: 'Energetic', upvotes: 145, category: 'social', users: 67 }
]

const topUsers = [
  { id: 1, name: 'Sarah Chen', username: 'sarahc', traits: 23, upvotes: 456, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: 2, name: 'Mike Johnson', username: 'mikej', traits: 19, upvotes: 389, avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: 3, name: 'Emma Rodriguez', username: 'emmar', traits: 21, upvotes: 367, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }
]

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activeTab, setActiveTab] = useState('traits')

  const categories = ['all', 'mind', 'heart', 'social']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Explore YouTraIT</h1>
            <p className="text-gray-300">Discover trending traits and amazing people</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Search traits or users..."
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            {[
              { id: 'traits', label: 'Trending Traits', icon: TrendingUp },
              { id: 'users', label: 'Top Users', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'traits' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Trending Traits
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {trendingTraits.map((trait, index) => (
                  <motion.div
                    key={trait.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <TraitBubble 
                      trait={trait}
                      size="lg"
                      interactive={true}
                      transparent={index % 3 === 1}
                      onClick={() => console.log('View trait:', trait.word)}
                    />
                    <div className="mt-3">
                      <div className="text-white font-medium">{trait.word}</div>
                      <div className="text-gray-400 text-sm">{trait.users} users</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                Top Users This Week
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                    onClick={() => console.log('View user:', user.username)}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30"
                        />
                        {index < 3 && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-white">{user.traits}</div>
                        <div className="text-gray-400 text-xs">Traits</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{user.upvotes}</div>
                        <div className="text-gray-400 text-xs">Upvotes</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-xl font-bold text-white mb-4">
              Want to see your traits here?
            </h3>
            <p className="text-gray-300 mb-6">
              Build your trait cloud and climb the leaderboards!
            </p>
            <GlowButton>
              <Heart className="w-4 h-4" />
              Start Your Journey
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </div>
  )
}