'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtime } from '@/lib/realtime'
import { useAuthStore } from '@/lib/store'
import { GlowButton } from '@/components/ui/glow-button'
import { Heart, Users, Crown, Star, MessageCircle } from 'lucide-react'

export function BestieSystem() {
  const [bestieRequests, setBestieRequests] = useState([])
  const [currentBestie, setCurrentBestie] = useState(null)
  const [mutualTraits, setMutualTraits] = useState([])
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [requestMessage, setRequestMessage] = useState('')
  
  const { user } = useAuthStore()
  const { sendBestieRequest, respondToBestieRequest } = useRealtime()

  useEffect(() => {
    loadBestieData()
  }, [user])

  const loadBestieData = async () => {
    if (!user) return

    try {
      // Load pending requests
      const { data: requests } = await supabase
        .from('bestie_requests')
        .select(`
          *,
          requester:profiles!bestie_requests_requester_id_fkey(username, full_name, avatar_url)
        `)
        .eq('requested_id', user.id)
        .eq('status', 'pending')

      setBestieRequests(requests || [])

      // Load current bestie
      const { data: bestie } = await supabase
        .from('bestie_requests')
        .select(`
          *,
          bestie:profiles!bestie_requests_requested_id_fkey(username, full_name, avatar_url)
        `)
        .eq('requester_id', user.id)
        .eq('status', 'accepted')
        .single()

      if (bestie) {
        setCurrentBestie(bestie)
        loadMutualTraits(user.id, bestie.requested_id)
      }
    } catch (error) {
      console.error('Error loading bestie data:', error)
    }
  }

  const loadMutualTraits = async (user1Id, user2Id) => {
    try {
      const { data } = await supabase.rpc('get_mutual_traits', {
        user1_id: user1Id,
        user2_id: user2Id
      })

      setMutualTraits(data || [])
    } catch (error) {
      console.error('Error loading mutual traits:', error)
    }
  }

  const handleSendRequest = async () => {
    if (!selectedUser) return

    try {
      await sendBestieRequest(selectedUser.id, requestMessage)
      setShowRequestModal(false)
      setRequestMessage('')
      setSelectedUser(null)
    } catch (error) {
      console.error('Error sending bestie request:', error)
    }
  }

  const handleRespondToRequest = async (requestId, status) => {
    try {
      await respondToBestieRequest(requestId, status)
      setBestieRequests(prev => prev.filter(r => r.id !== requestId))
      
      if (status === 'accepted') {
        loadBestieData() // Reload to get new bestie
      }
    } catch (error) {
      console.error('Error responding to request:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Bestie Display */}
      {currentBestie && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-6 border border-pink-500/30"
        >
          <div className="flex items-center gap-4 mb-6">
            <Crown className="w-8 h-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-bold text-white">Your Bestie</h3>
              <p className="text-gray-300">Special friend connection</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={currentBestie.bestie.avatar_url}
              alt={currentBestie.bestie.full_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
            />
            <div>
              <h4 className="text-lg font-semibold text-white">
                {currentBestie.bestie.full_name}
              </h4>
              <p className="text-gray-400">@{currentBestie.bestie.username}</p>
            </div>
          </div>

          {/* Mutual Traits */}
          {mutualTraits.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                Mutual Traits ({mutualTraits.length})
              </h5>
              <div className="flex flex-wrap gap-2">
                {mutualTraits.map((trait, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                  >
                    {trait.word}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Bestie Requests */}
      {bestieRequests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
        >
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Bestie Requests</h3>
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              {bestieRequests.length}
            </span>
          </div>

          <div className="space-y-4">
            {bestieRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700/30 rounded-xl p-4 border border-gray-600"
              >
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={request.requester.avatar_url}
                    alt={request.requester.full_name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-500"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">
                      {request.requester.full_name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      @{request.requester.username}
                    </p>
                  </div>
                </div>

                {request.message && (
                  <div className="bg-gray-600/30 rounded-lg p-3 mb-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                      <p className="text-gray-300 text-sm italic">"{request.message}"</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <GlowButton
                    size="sm"
                    onClick={() => handleRespondToRequest(request.id, 'accepted')}
                    className="flex-1"
                  >
                    <Heart className="w-4 h-4" />
                    Accept
                  </GlowButton>
                  <GlowButton
                    variant="outline"
                    size="sm"
                    onClick={() => handleRespondToRequest(request.id, 'rejected')}
                    className="flex-1 hover:border-red-500 hover:text-red-400"
                  >
                    Decline
                  </GlowButton>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Send Bestie Request */}
      {!currentBestie && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700">
            <Star className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Find Your Bestie</h3>
            <p className="text-gray-400 mb-6">
              Nominate a special friend to be your bestie and showcase your mutual traits!
            </p>
            <GlowButton onClick={() => setShowRequestModal(true)}>
              <Users className="w-4 h-4" />
              Send Bestie Request
            </GlowButton>
          </div>
        </motion.div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 border border-gray-700 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Send Bestie Request</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Search for a friend
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username or name..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Personal message (optional)
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Why do you want them as your bestie?"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <GlowButton
                    onClick={handleSendRequest}
                    disabled={!selectedUser}
                    className="flex-1"
                  >
                    Send Request
                  </GlowButton>
                  <GlowButton
                    variant="outline"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}