'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, Info, AlertCircle } from 'lucide-react'

export function FloatingNotifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleFloatingNotification = (event) => {
      const { message, type = 'info' } = event.detail
      
      const id = Date.now() + Math.random()
      const notification = {
        id,
        message,
        type,
        timestamp: Date.now()
      }

      setNotifications(prev => [...prev, notification])

      // Auto remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 5000)
    }

    window.addEventListener('floatingNotification', handleFloatingNotification)
    return () => window.removeEventListener('floatingNotification', handleFloatingNotification)
  }, [])

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Info className="w-5 h-5 text-blue-400" />
    }
  }

  const getColors = (type) => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30'
      case 'error':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30'
      default:
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`bg-gradient-to-r ${getColors(notification.type)} backdrop-blur-sm rounded-xl p-4 border shadow-lg`}
          >
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}