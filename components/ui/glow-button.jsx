'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function GlowButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/25',
    outline: 'border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300',
    ghost: 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={cn(
        'relative rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
        'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-purple-500/20 before:to-pink-500/20 before:blur-xl before:transition-all before:duration-300',
        'hover:before:from-purple-500/30 hover:before:to-pink-500/30',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        )}
        {children}
      </span>
    </motion.button>
  )
}