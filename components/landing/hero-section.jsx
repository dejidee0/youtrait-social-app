'use client'

import { motion } from 'framer-motion'
import { GlowButton } from '@/components/ui/glow-button'
import { TraitBubble } from '@/components/ui/trait-bubble'
import { Sparkles, Users, Heart } from 'lucide-react'

const demoTraits = [
  { id: 1, word: 'Creative', upvotes: 15, category: 'mind', transparent: false },
  { id: 2, word: 'Kind', upvotes: 23, category: 'heart', transparent: true },
  { id: 3, word: 'Funny', upvotes: 18, category: 'social', transparent: false },
  { id: 4, word: 'Smart', upvotes: 12, category: 'mind', transparent: true },
  { id: 5, word: 'Loyal', upvotes: 20, category: 'heart', transparent: false },
  { id: 6, word: 'Energetic', upvotes: 8, category: 'social', transparent: true }
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-6"
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Discover Your True Self</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Who Are You...{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Really?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl"
            >
              Let the world decide. Showcase your personality through traits, reactions & stories. 
              Build your unique trait cloud and discover what makes you... you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <GlowButton href="/auth" size="lg" className="group">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Get My Trait Cloud
              </GlowButton>
              <GlowButton href="/explore" variant="outline" size="lg">
                <Heart className="w-5 h-5" />
                Explore Traits
              </GlowButton>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 text-sm"
            >
              <div className="text-center">
                <div className="text-xl font-bold text-white">2.5K+</div>
                <div className="text-xs text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">8.2K+</div>
                <div className="text-xs text-gray-400">Traits</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-white">94%</div>
                <div className="text-xs text-gray-400">Love It</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Trait Cloud Demo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-96 lg:h-[500px]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Central avatar */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 2, repeat: Infinity }
                }}
                className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50"
              >
                <span className="text-white font-bold text-xl">You</span>
              </motion.div>

              {/* Orbiting traits */}
              {demoTraits.map((trait, index) => {
                const angle = (index * 60) * (Math.PI / 180)
                const radius = 120 + (index % 2) * 40
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={trait.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: [x, x + 10, x],
                      y: [y, y - 10, y]
                    }}
                    transition={{ 
                      delay: index * 0.2,
                      x: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                      y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }
                    }}
                    className="absolute"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(${x}px, ${y}px)`
                    }}
                  >
                    <TraitBubble 
                      trait={trait} 
                      interactive={false}
                      size="sm"
                      transparent={trait.transparent}
                    />
                  </motion.div>
                )
              })}
            </div>

            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                animate={{
                  x: [0, Math.random() * 400 - 200],
                  y: [0, Math.random() * 400 - 200],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}