'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { Brain, Heart, Users, Zap, Eye, Lightbulb } from 'lucide-react'

export function TraitDNAProfile() {
  const [dnaData, setDnaData] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    if (user) {
      loadDNAProfile()
    }
  }, [user])

  const loadDNAProfile = async () => {
    try {
      setLoading(true)
      
      // Calculate DNA if not exists
      await supabase.rpc('calculate_personality_dna', {
        target_user_id: user.id
      })
      
      // Load DNA profile
      const { data, error } = await supabase
        .from('personality_dna')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      setDnaData(data)
    } catch (error) {
      console.error('Error loading DNA profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDNACategories = () => {
    if (!dnaData) return []

    return [
      {
        name: 'Mind',
        score: dnaData.mind_score || 0,
        icon: Brain,
        color: 'from-blue-500 to-cyan-500',
        description: 'Intelligence, creativity, and analytical thinking'
      },
      {
        name: 'Heart',
        score: dnaData.heart_score || 0,
        icon: Heart,
        color: 'from-pink-500 to-red-500',
        description: 'Empathy, kindness, and emotional intelligence'
      },
      {
        name: 'Social',
        score: dnaData.social_score || 0,
        icon: Users,
        color: 'from-green-500 to-emerald-500',
        description: 'Charisma, humor, and social connections'
      }
    ]
  }

  const getPersonalityInsights = () => {
    if (!dnaData) return []

    const categories = getDNACategories()
    const dominant = categories.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    )

    const insights = [
      `Your strongest trait category is ${dominant.name.toLowerCase()} (${Math.round(dominant.score)}%)`,
    ]

    if (dnaData.mind_score > 70) {
      insights.push("You're highly analytical and creative")
    }
    if (dnaData.heart_score > 70) {
      insights.push("You have exceptional emotional intelligence")
    }
    if (dnaData.social_score > 70) {
      insights.push("You're naturally charismatic and social")
    }

    return insights
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

  if (!dnaData) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">DNA Profile Not Ready</h3>
        <p className="text-gray-400">
          Get more traits approved to generate your personality DNA profile!
        </p>
      </div>
    )
  }

  const categories = getDNACategories()
  const insights = getPersonalityInsights()

  return (
    <div className="space-y-8">
      {/* DNA Rings Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Your Personality DNA
            </h2>
            <p className="text-gray-400">
              Discover the unique combination that makes you... you
            </p>
          </div>

          {/* DNA Rings */}
          <div className="relative w-80 h-80 mx-auto">
            {categories.map((category, index) => {
              const radius = 120 - (index * 30)
              const circumference = 2 * Math.PI * radius
              const strokeDasharray = circumference
              const strokeDashoffset = circumference - (category.score / 100) * circumference

              return (
                <motion.div
                  key={category.name}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.3, duration: 1 }}
                  className="absolute inset-0"
                >
                  <svg className="w-full h-full transform -rotate-90">
                    {/* Background ring */}
                    <circle
                      cx="160"
                      cy="160"
                      r={radius}
                      fill="none"
                      stroke="rgba(75, 85, 99, 0.3)"
                      strokeWidth="8"
                    />
                    
                    {/* Progress ring */}
                    <motion.circle
                      cx="160"
                      cy="160"
                      r={radius}
                      fill="none"
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={strokeDasharray}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ delay: index * 0.3 + 0.5, duration: 1.5 }}
                      className="drop-shadow-lg"
                      style={{
                        filter: `drop-shadow(0 0 10px ${category.color.includes('blue') ? '#3B82F6' : 
                          category.color.includes('pink') ? '#EC4899' : '#10B981'})`
                      }}
                    />
                    
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={
                          category.color.includes('blue') ? '#3B82F6' : 
                          category.color.includes('pink') ? '#EC4899' : '#10B981'
                        } />
                        <stop offset="100%" stopColor={
                          category.color.includes('blue') ? '#06B6D4' : 
                          category.color.includes('pink') ? '#EF4444' : '#059669'
                        } />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Category label */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.3 + 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `translate(${Math.cos((index * 120 - 90) * Math.PI / 180) * (radius + 40)}px, ${Math.sin((index * 120 - 90) * Math.PI / 180) * (radius + 40)}px)`
                    }}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mb-2 shadow-lg`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-white font-semibold">{category.name}</div>
                      <div className="text-gray-400 text-sm">{Math.round(category.score)}%</div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}

            {/* Center content */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-3 shadow-2xl"
                >
                  <Zap className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-white font-bold">DNA</div>
                <div className="text-gray-400 text-sm">Profile</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Insights Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Personality Insights</h3>
        </div>

        <div className="space-y-4">
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-gray-700/30 rounded-xl border border-gray-600"
            >
              <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300">{insight}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid md:grid-cols-3 gap-6"
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            className={`bg-gradient-to-br ${category.color.replace('to-', 'to-').replace('from-', 'from-')}/10 rounded-2xl p-6 border border-gray-600`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{category.name}</h4>
                <div className="text-2xl font-bold text-white">{Math.round(category.score)}%</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{category.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}