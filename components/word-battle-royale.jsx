'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/lib/store'
import { GlowButton } from '@/components/ui/glow-button'
import { Trophy, Crown, Zap, Users, Timer, Star, Medal } from 'lucide-react'

export function WordBattleRoyale() {
  const [currentBattle, setCurrentBattle] = useState(null)
  const [participants, setParticipants] = useState([])
  const [userParticipation, setUserParticipation] = useState(null)
  const [timeRemaining, setTimeRemaining] = useState('')
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()

  useEffect(() => {
    loadCurrentBattle()
    const interval = setInterval(loadCurrentBattle, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (currentBattle) {
      const timer = setInterval(updateTimeRemaining, 1000)
      return () => clearInterval(timer)
    }
  }, [currentBattle])

  const loadCurrentBattle = async () => {
    try {
      setLoading(true)
      
      // Get current active battle
      const { data: battle } = await supabase
        .from('word_battles')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (battle) {
        setCurrentBattle(battle)
        await loadParticipants(battle.id)
        await checkUserParticipation(battle.id)
      } else {
        // Create new battle if none exists
        await createNewBattle()
      }
    } catch (error) {
      console.error('Error loading battle:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadParticipants = async (battleId) => {
    const { data } = await supabase
      .from('battle_participants')
      .select(`
        *,
        user:profiles!battle_participants_user_id_fkey(username, full_name, avatar_url)
      `)
      .eq('battle_id', battleId)
      .order('votes_received', { ascending: false })
      .limit(10)

    setParticipants(data || [])
  }

  const checkUserParticipation = async (battleId) => {
    if (!user) return

    const { data } = await supabase
      .from('battle_participants')
      .select('*')
      .eq('battle_id', battleId)
      .eq('user_id', user.id)
      .single()

    setUserParticipation(data)
  }

  const createNewBattle = async () => {
    try {
      const { data } = await supabase.rpc('create_daily_battle')
      if (data) {
        await loadCurrentBattle()
      }
    } catch (error) {
      console.error('Error creating battle:', error)
    }
  }

  const joinBattle = async () => {
    if (!user || !currentBattle) return

    try {
      const { error } = await supabase
        .from('battle_participants')
        .insert({
          battle_id: currentBattle.id,
          user_id: user.id
        })

      if (!error) {
        await loadParticipants(currentBattle.id)
        await checkUserParticipation(currentBattle.id)
      }
    } catch (error) {
      console.error('Error joining battle:', error)
    }
  }

  const voteForParticipant = async (participantId) => {
    try {
      // Increment vote count
      const { error } = await supabase.rpc('increment_battle_votes', {
        participant_id: participantId
      })

      if (!error) {
        await loadParticipants(currentBattle.id)
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const updateTimeRemaining = () => {
    if (!currentBattle) return

    const now = new Date()
    const endTime = new Date(currentBattle.ends_at)
    const diff = endTime - now

    if (diff <= 0) {
      setTimeRemaining('Battle Ended')
      return
    }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`)
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />
      default:
        return <Star className="w-4 h-4 text-gray-500" />
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
      case 2:
        return 'from-gray-500/20 to-gray-400/20 border-gray-400/30'
      case 3:
        return 'from-orange-500/20 to-red-500/20 border-orange-500/30'
      default:
        return 'from-gray-700/20 to-gray-600/20 border-gray-600/30'
    }
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

  if (!currentBattle) {
    return (
      <div className="text-center py-12">
        <Trophy className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Active Battle</h3>
        <p className="text-gray-400 mb-6">Check back later for the next word battle!</p>
        <GlowButton onClick={createNewBattle}>
          <Zap className="w-4 h-4" />
          Start New Battle
        </GlowButton>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Battle Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Word Battle Royale</h2>
              <p className="text-gray-300">Daily trait challenge</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 text-yellow-400 mb-1">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-sm">{timeRemaining}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>{participants.length} participants</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-lg text-gray-300 mb-2">Today's Battle Word:</h3>
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              textShadow: [
                '0 0 10px rgba(139, 92, 246, 0.5)',
                '0 0 20px rgba(139, 92, 246, 0.8)',
                '0 0 10px rgba(139, 92, 246, 0.5)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            {currentBattle.battle_word}
          </motion.div>
          <p className="text-gray-400 mt-2">{currentBattle.description}</p>
        </div>

        {!userParticipation && (
          <div className="text-center mt-6">
            <GlowButton onClick={joinBattle}>
              <Zap className="w-4 h-4" />
              Join Battle
            </GlowButton>
          </div>
        )}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
      >
        <div className="flex items-center gap-3 mb-6">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-bold text-white">Live Leaderboard</h3>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No participants yet. Be the first to join!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {participants.map((participant, index) => (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-r ${getRankColor(participant.rank || index + 1)} rounded-xl p-4 border`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getRankIcon(participant.rank || index + 1)}
                        <span className="text-white font-bold text-lg">
                          #{participant.rank || index + 1}
                        </span>
                      </div>
                      
                      <img
                        src={participant.user.avatar_url}
                        alt={participant.user.full_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
                      />
                      
                      <div>
                        <h4 className="font-semibold text-white">
                          {participant.user.full_name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          @{participant.user.username}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {participant.votes_received}
                        </div>
                        <div className="text-gray-400 text-xs">votes</div>
                      </div>
                      
                      {user?.id !== participant.user_id && (
                        <GlowButton
                          size="sm"
                          onClick={() => voteForParticipant(participant.id)}
                        >
                          <Star className="w-4 h-4" />
                          Vote
                        </GlowButton>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Prize Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-500/20"
      >
        <div className="flex items-center gap-3 mb-3">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Today's Prize</h3>
        </div>
        <p className="text-gray-300">{currentBattle.prize_description}</p>
      </motion.div>
    </div>
  )
}