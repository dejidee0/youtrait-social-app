'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, Star, TrendingUp, Users, Zap } from 'lucide-react'

// Mock leaderboard data
const leaderboardData = [
  { id: 1, name: 'Sarah Chen', username: 'sarahc', traits: 28, upvotes: 567, rank: 1, avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', badge: 'Trait Master' },
  { id: 2, name: 'Mike Johnson', username: 'mikej', traits: 25, upvotes: 489, rank: 2, avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', badge: 'Social Star' },
  { id: 3, name: 'Emma Rodriguez', username: 'emmar', traits: 23, upvotes: 445, rank: 3, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', badge: 'Rising Star' },
  { id: 4, name: 'Alex Kim', username: 'alexk', traits: 21, upvotes: 398, rank: 4, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', badge: 'Authentic' },
  { id: 5, name: 'Jordan Smith', username: 'jordans', traits: 19, upvotes: 356, rank: 5, avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', badge: 'Creative' }
]

const categories = [
  { id: 'overall', label: 'Overall', icon: Trophy },
  { id: 'traits', label: 'Most Traits', icon: Star },
  { id: 'upvotes', label: 'Most Upvotes', icon: TrendingUp },
  { id: 'weekly', label: 'This Week', icon: Zap }
]

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState('overall')
  const [timeframe, setTimeframe] = useState('all-time')

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-400" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</div>
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'from-gray-400/20 to-gray-300/20 border-gray-400/30'
      case 3:
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30'
      default:
        return 'from-gray-700/20 to-gray-600/20 border-gray-600/30'
    }
  }

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
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
            </div>
            <p className="text-gray-300">See who's building the most amazing trait clouds</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="order-1 md:order-1"
            >
              <div className="bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-2xl p-6 border border-gray-400/30 text-center h-64 flex flex-col justify-center">
                <div className="relative mb-4">
                  <img
                    src={leaderboardData[1].avatar}
                    alt={leaderboardData[1].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-gray-300 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-800 font-bold text-sm">2</span>
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg">{leaderboardData[1].name}</h3>
                <p className="text-gray-400 text-sm">@{leaderboardData[1].username}</p>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-white">{leaderboardData[1].upvotes}</div>
                  <div className="text-gray-400 text-sm">upvotes</div>
                </div>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="order-2 md:order-2"
            >
              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-500/30 text-center h-72 flex flex-col justify-center relative">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="relative mb-4">
                  <img
                    src={leaderboardData[0].avatar}
                    alt={leaderboardData[0].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-yellow-900 font-bold">1</span>
                  </div>
                </div>
                <h3 className="font-bold text-white text-xl">{leaderboardData[0].name}</h3>
                <p className="text-gray-400">@{leaderboardData[0].username}</p>
                <div className="mt-3">
                  <div className="text-3xl font-bold text-white">{leaderboardData[0].upvotes}</div>
                  <div className="text-gray-400">upvotes</div>
                </div>
                <div className="absolute top-2 right-2 bg-yellow-400/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                  {leaderboardData[0].badge}
                </div>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="order-3 md:order-3"
            >
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl p-6 border border-orange-500/30 text-center h-64 flex flex-col justify-center">
                <div className="relative mb-4">
                  <img
                    src={leaderboardData[2].avatar}
                    alt={leaderboardData[2].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-400 mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-orange-900 font-bold text-sm">3</span>
                  </div>
                </div>
                <h3 className="font-bold text-white text-lg">{leaderboardData[2].name}</h3>
                <p className="text-gray-400 text-sm">@{leaderboardData[2].username}</p>
                <div className="mt-3">
                  <div className="text-2xl font-bold text-white">{leaderboardData[2].upvotes}</div>
                  <div className="text-gray-400 text-sm">upvotes</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700"
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              Full Rankings
            </h2>
            
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`bg-gradient-to-r ${getRankColor(user.rank)} rounded-xl p-4 border cursor-pointer hover:scale-[1.02] transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        {getRankIcon(user.rank)}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                          {user.name}
                          {user.rank <= 3 && (
                            <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs">
                              {user.badge}
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-400 text-sm">@{user.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-right">
                      <div>
                        <div className="text-lg font-bold text-white">{user.traits}</div>
                        <div className="text-gray-400 text-xs">traits</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white">{user.upvotes}</div>
                        <div className="text-gray-400 text-xs">upvotes</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}