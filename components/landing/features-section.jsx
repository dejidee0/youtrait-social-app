'use client'

import { motion } from 'framer-motion'
import { Heart, Users, Zap, Shield, Sparkles, Trophy } from 'lucide-react'

const features = [
  {
    icon: Heart,
    title: 'Trait Reactions',
    description: 'Friends can react with emojis (🔥, 💯, 👑) that float onto your traits with beautiful animations',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: Users,
    title: 'Bestie System',
    description: 'Nominate a special friend as your Bestie and showcase mutual traits on your profiles',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    description: 'New traits and upvotes appear instantly on your trait cloud with smooth animations',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Approval Control',
    description: 'You have full control over which traits appear on your profile through our approval system',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Sparkles,
    title: 'Trait Cards',
    description: 'Export beautiful animated trait cards to share your personality on social media',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Trophy,
    title: 'Personality DNA',
    description: 'Visualize your personality with glowing rings showing your Mind, Heart, and Social strengths',
    color: 'from-cyan-500 to-teal-500'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Powerful <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Features</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to build and showcase your authentic personality
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-all duration-300`} />
              
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 group-hover:border-gray-600 transition-all duration-300 h-full">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 border border-purple-500/30">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">
                  Experience the Magic of <span className="text-purple-400">Live Reactions</span>
                </h3>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Watch as your friends' reactions float onto your traits in real-time. 
                  Every 🔥, 💯, and 👑 adds life to your personality cloud with stunning animations.
                </p>
                <div className="flex gap-4">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    🔥
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="text-2xl"
                  >
                    💯
                  </motion.div>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    className="text-2xl"
                  >
                    👑
                  </motion.div>
                </div>
              </div>
              
              <div className="relative">
                {/* Demo trait with floating reactions */}
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-32 h-32 flex items-center justify-center mx-auto shadow-2xl"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <span className="text-white font-bold text-lg">Creative</span>
                </motion.div>
                
                {/* Floating reactions */}
                {['🔥', '💯', '👑'].map((emoji, index) => (
                  <motion.div
                    key={index}
                    className="absolute text-2xl"
                    animate={{
                      y: [0, -50, -100],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 1
                    }}
                    style={{
                      left: `${50 + (index - 1) * 20}%`,
                      top: '50%'
                    }}
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}