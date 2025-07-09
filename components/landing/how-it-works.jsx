'use client'

import { motion } from 'framer-motion'
import { UserPlus, CheckCircle, Sparkles } from 'lucide-react'

const steps = [
  {
    icon: UserPlus,
    title: 'Endorse',
    description: 'Friends submit one-word traits about you',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: CheckCircle,
    title: 'Approve',
    description: 'You decide which traits represent you',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Sparkles,
    title: 'Cloud Grows',
    description: 'Your trait cloud evolves with every endorsement',
    color: 'from-purple-500 to-pink-500'
  }
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three simple steps to discover your authentic self through the eyes of others
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300`}
                >
                  <step.icon className="w-12 h-12 text-white" />
                </motion.div>

                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white text-gray-900 rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6">See It In Action</h3>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Demo trait submission */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30"
              >
                <div className="text-blue-400 font-semibold mb-2">Sarah says you're:</div>
                <div className="text-2xl font-bold text-white">"Creative"</div>
              </motion.div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-400"
              >
                →
              </motion.div>

              {/* Demo approval */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30"
              >
                <div className="text-green-400 font-semibold mb-2">You approve:</div>
                <div className="text-2xl font-bold text-white">✓ Creative</div>
              </motion.div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="text-purple-400"
              >
                →
              </motion.div>

              {/* Demo cloud growth */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30"
              >
                <div className="text-purple-400 font-semibold mb-2">Your cloud grows:</div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl font-bold text-white"
                >
                  ✨ Creative
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}