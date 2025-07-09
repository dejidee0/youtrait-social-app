'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuthStore, useTraitsStore, useNotificationsStore, useStatsStore } from '@/lib/store'
import { auth, traits, notifications } from '@/lib/supabase'
import { GlowButton } from '@/components/ui/glow-button'
import { TraitCloud } from '@/components/trait-cloud'
import { TraitApprovalInbox } from '@/components/trait-approval-inbox'
import { 
  User, 
  Sparkles, 
  Heart, 
  Users, 
  TrendingUp, 
  Bell,
  Settings,
  Plus,
  Crown,
  Zap
} from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('cloud')
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const { user, profile, setUser, setProfile } = useAuthStore()
  const { traits: userTraits, setTraits } = useTraitsStore()
  const { notifications: userNotifications, unreadCount } = useNotificationsStore()
  const { stats, setStats } = useStatsStore()

  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }
      setUser(user)
      await loadDashboardData(user.id)
      setLoading(false)
    }

    checkAuth()
  }, [])

  const loadDashboardData = async (userId) => {
    try {
      // Load user traits
      const { data: traitsData } = await traits.getForUser(userId)
      if (traitsData) setTraits(traitsData)

      // Load notifications
      const { data: notificationsData } = await notifications.get(userId)
      if (notificationsData) {
        // This would be handled by the notifications store
      }

      // Mock stats for now
      setStats({
        totalTraits: traitsData?.length || 0,
        approvedTraits: traitsData?.filter(t => t.status === 'approved').length || 0,
        pendingTraits: traitsData?.filter(t => t.status === 'pending').length || 0,
        totalUpvotes: traitsData?.reduce((sum, t) => sum + t.upvotes, 0) || 0,
        traitsGiven: 0
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const handleLogout = async () => {
    await auth.signOut()
    setUser(null)
    setProfile(null)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  const tabs = [
    { id: 'cloud', label: 'Trait Cloud', icon: Sparkles },
    { id: 'inbox', label: 'Approval Inbox', icon: Bell, badge: unreadCount },
    { id: 'stats', label: 'Stats', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">YouTraIT</span>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{user?.email}</span>
              </div>

              <GlowButton
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                <Settings className="w-4 h-4" />
                Logout
              </GlowButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-300">
            Your trait cloud is looking amazing. Here's what's happening:
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalTraits}</div>
                <div className="text-sm text-gray-400">Total Traits</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.totalUpvotes}</div>
                <div className="text-sm text-gray-400">Total Upvotes</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.approvedTraits}</div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stats.pendingTraits}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 min-h-[500px]"
        >
          {activeTab === 'cloud' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Trait Cloud</h2>
                <GlowButton size="sm">
                  <Plus className="w-4 h-4" />
                  Add Trait
                </GlowButton>
              </div>
              <TraitCloud traits={userTraits} />
            </div>
          )}

          {activeTab === 'inbox' && (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Approval Inbox</h2>
                <div className="text-sm text-gray-400">
                  {unreadCount} pending approvals
                </div>
              </div>
              <TraitApprovalInbox />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Your Stats</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* Trait categories */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Trait Categories</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Mind</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
                        </div>
                        <span className="text-sm text-gray-400">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Heart</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full" />
                        </div>
                        <span className="text-sm text-gray-400">80%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Social</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-3/5 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                        </div>
                        <span className="text-sm text-gray-400">60%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent activity */}
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                      <span className="text-gray-300 text-sm">Sarah endorsed you as "Creative"</span>
                      <span className="text-gray-500 text-xs ml-auto">2h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <span className="text-gray-300 text-sm">You approved "Funny" trait</span>
                      <span className="text-gray-500 text-xs ml-auto">4h ago</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full" />
                      <span className="text-gray-300 text-sm">"Kind" trait got 3 new upvotes</span>
                      <span className="text-gray-500 text-xs ml-auto">1d ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
              <div className="max-w-2xl">
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{user?.email}</h3>
                      <p className="text-gray-400">Member since {new Date(user?.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        rows={3}
                        placeholder="Tell the world about yourself..."
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="Your location"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                        <input
                          type="url"
                          className="w-full px-4 py-3 bg-gray-600/50 border border-gray-500 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <GlowButton>
                        Save Changes
                      </GlowButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}