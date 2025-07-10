'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function GlowButton({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  href,
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

  const ButtonComponent = motion.button
  const LinkComponent = motion.div
  
  const buttonContent = (
    <>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />
      </div>
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        ) : null}
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <Link href={href}>
        <LinkComponent
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            baseClasses,
            variants[variant],
            sizes[size],
            className
          )}
          {...props}
        >
          {buttonContent}
        </LinkComponent>
      </Link>
    )
  }

  return (
    <ButtonComponent
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
    >
      {buttonContent}
    </ButtonComponent>
  )
}