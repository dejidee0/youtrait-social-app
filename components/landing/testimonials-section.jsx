'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Chen',
    username: '@sarahc',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'YouTraIT helped me see myself through my friends\' eyes. I never realized how much my creativity meant to others!',
    traits: ['Creative', 'Inspiring', 'Thoughtful'],
    rating: 5
  },
  {
    name: 'Marcus Johnson',
    username: '@marcusj',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The trait cloud is addictive! Watching it grow with each endorsement feels like leveling up in real life.',
    traits: ['Funny', 'Loyal', 'Energetic'],
    rating: 5
  },
  {
    name: 'Emma Rodriguez',
    username: '@emmar',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'I love how I can control which traits appear on my profile. It\'s like curating the best version of myself.',
    traits: ['Kind', 'Smart', 'Reliable'],
    rating: 5
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            What People Are <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Saying</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands who have discovered their authentic selves through YouTraIT
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 rounded-2xl blur-xl transition-all duration-300" />
              
              <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 group-hover:border-purple-500/50 transition-all duration-300 h-full">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-purple-400 mb-6" />
                
                {/* Content */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  "{testimonial.content}"
                </p>
                
                {/* User traits */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {testimonial.traits.map((trait, traitIndex) => (
                    <motion.span
                      key={traitIndex}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + traitIndex * 0.1 }}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30"
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
                
                {/* User info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm">{testimonial.username}</div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 border border-purple-500/20">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-gray-400">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">10K+</div>
                <div className="text-gray-400">Traits Shared</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">2.5K+</div>
                <div className="text-gray-400">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">95%</div>
                <div className="text-gray-400">Would Recommend</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}