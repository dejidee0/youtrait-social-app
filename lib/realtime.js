import { supabase } from './supabase'
import { useTraitsStore, useNotificationsStore, useAuthStore } from './store'

class RealtimeManager {
  constructor() {
    this.subscriptions = new Map()
    this.isConnected = false
  }

  // Initialize realtime connections
  async initialize(userId) {
    if (!userId || this.isConnected) return

    try {
      // Subscribe to trait changes
      await this.subscribeToTraits(userId)
      
      // Subscribe to notifications
      await this.subscribeToNotifications(userId)
      
      // Subscribe to trait reactions
      await this.subscribeToTraitReactions(userId)
      
      // Subscribe to bestie requests
      await this.subscribeToBestieRequests(userId)
      
      this.isConnected = true
      console.log('Realtime connections established')
    } catch (error) {
      console.error('Failed to initialize realtime:', error)
    }
  }

  // Subscribe to trait changes
  async subscribeToTraits(userId) {
    const subscription = supabase
      .channel('traits')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'traits',
        filter: `target_user=eq.${userId}`
      }, (payload) => {
        this.handleTraitChange(payload)
      })
      .subscribe()

    this.subscriptions.set('traits', subscription)
  }

  // Subscribe to notifications
  async subscribeToNotifications(userId) {
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        this.handleNewNotification(payload)
      })
      .subscribe()

    this.subscriptions.set('notifications', subscription)
  }

  // Subscribe to trait reactions
  async subscribeToTraitReactions(userId) {
    const subscription = supabase
      .channel('trait_reactions')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'trait_reactions_enhanced'
      }, (payload) => {
        this.handleTraitReaction(payload)
      })
      .subscribe()

    this.subscriptions.set('trait_reactions', subscription)
  }

  // Subscribe to bestie requests
  async subscribeToBestieRequests(userId) {
    const subscription = supabase
      .channel('bestie_requests')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bestie_requests',
        filter: `requested_id=eq.${userId}`
      }, (payload) => {
        this.handleBestieRequest(payload)
      })
      .subscribe()

    this.subscriptions.set('bestie_requests', subscription)
  }

  // Handle trait changes
  handleTraitChange(payload) {
    const { eventType, new: newRecord, old: oldRecord } = payload
    const { updateTrait, addTrait, removeTrait } = useTraitsStore.getState()

    switch (eventType) {
      case 'INSERT':
        addTrait(newRecord)
        this.showFloatingNotification(`New trait: ${newRecord.word}`, 'success')
        break
      case 'UPDATE':
        updateTrait(newRecord.id, newRecord)
        if (newRecord.status === 'approved' && oldRecord.status === 'pending') {
          this.showFloatingNotification(`Trait "${newRecord.word}" approved!`, 'success')
        }
        break
      case 'DELETE':
        removeTrait(oldRecord.id)
        break
    }
  }

  // Handle new notifications
  handleNewNotification(payload) {
    const { new: notification } = payload
    const { addNotification } = useNotificationsStore.getState()
    
    addNotification(notification)
    this.showFloatingNotification(notification.title, 'info')
  }

  // Handle trait reactions
  handleTraitReaction(payload) {
    const { new: reaction } = payload
    
    // Trigger floating animation
    this.triggerReactionAnimation(reaction)
  }

  // Handle bestie requests
  handleBestieRequest(payload) {
    const { eventType, new: newRecord } = payload
    
    if (eventType === 'INSERT') {
      this.showFloatingNotification('New bestie request!', 'info')
    } else if (eventType === 'UPDATE' && newRecord.status === 'accepted') {
      this.showFloatingNotification('Bestie request accepted!', 'success')
    }
  }

  // Trigger reaction animation
  triggerReactionAnimation(reaction) {
    // Create floating emoji animation
    const event = new CustomEvent('traitReaction', {
      detail: {
        traitId: reaction.trait_id,
        emoji: reaction.emoji,
        animationType: reaction.animation_type,
        position: {
          x: reaction.position_x,
          y: reaction.position_y
        }
      }
    })
    
    window.dispatchEvent(event)
  }

  // Show floating notification
  showFloatingNotification(message, type = 'info') {
    const event = new CustomEvent('floatingNotification', {
      detail: { message, type }
    })
    
    window.dispatchEvent(event)
  }

  // Disconnect all subscriptions
  disconnect() {
    this.subscriptions.forEach((subscription) => {
      supabase.removeChannel(subscription)
    })
    
    this.subscriptions.clear()
    this.isConnected = false
    console.log('Realtime connections closed')
  }

  // Send trait reaction
  async sendTraitReaction(traitId, emoji, position = { x: 0, y: 0 }) {
    try {
      const { user } = useAuthStore.getState()
      if (!user) return

      const { data, error } = await supabase
        .from('trait_reactions_enhanced')
        .insert({
          trait_id: traitId,
          user_id: user.id,
          emoji,
          animation_type: 'float',
          position_x: position.x,
          position_y: position.y
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending reaction:', error)
    }
  }

  // Send bestie request
  async sendBestieRequest(requestedUserId, message = '') {
    try {
      const { user } = useAuthStore.getState()
      if (!user) return

      const { data, error } = await supabase
        .from('bestie_requests')
        .insert({
          requester_id: user.id,
          requested_id: requestedUserId,
          message
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending bestie request:', error)
    }
  }

  // Respond to bestie request
  async respondToBestieRequest(requestId, status) {
    try {
      const { data, error } = await supabase
        .from('bestie_requests')
        .update({
          status,
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error responding to bestie request:', error)
    }
  }
}

// Create singleton instance
export const realtimeManager = new RealtimeManager()

// React hook for realtime
export function useRealtime() {
  const { user } = useAuthStore()

  const initialize = () => {
    if (user?.id) {
      realtimeManager.initialize(user.id)
    }
  }

  const disconnect = () => {
    realtimeManager.disconnect()
  }

  const sendReaction = (traitId, emoji, position) => {
    return realtimeManager.sendTraitReaction(traitId, emoji, position)
  }

  const sendBestieRequest = (userId, message) => {
    return realtimeManager.sendBestieRequest(userId, message)
  }

  const respondToBestieRequest = (requestId, status) => {
    return realtimeManager.respondToBestieRequest(requestId, status)
  }

  return {
    initialize,
    disconnect,
    sendReaction,
    sendBestieRequest,
    respondToBestieRequest,
    isConnected: realtimeManager.isConnected
  }
}