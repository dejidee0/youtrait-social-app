import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email, password, metadata = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Profile helpers
export const profiles = {
  get: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  },

  update: async (userId, updates) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    return { data, error }
  },

  create: async (profile) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single()
    return { data, error }
  },

  search: async (query) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, avatar_url')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10)
    return { data, error }
  }
}

// Traits helpers
export const traits = {
  getForUser: async (userId) => {
    const { data, error } = await supabase
      .from('traits')
      .select(`
        *,
        created_by_profile:profiles!traits_created_by_fkey(username, full_name, avatar_url),
        reactions:trait_reactions(emoji, user_id)
      `)
      .eq('target_user', userId)
      .eq('status', 'approved')
      .order('upvotes', { ascending: false })
    return { data, error }
  },

  create: async (trait) => {
    const { data, error } = await supabase
      .from('traits')
      .insert(trait)
      .select()
      .single()
    return { data, error }
  },

  updateStatus: async (traitId, status) => {
    const { data, error } = await supabase
      .from('traits')
      .update({ 
        status, 
        approved_at: status === 'approved' ? new Date().toISOString() : null 
      })
      .eq('id', traitId)
      .select()
      .single()
    return { data, error }
  },

  upvote: async (traitId) => {
    const { data, error } = await supabase.rpc('increment_trait_upvotes', {
      trait_id: traitId
    })
    return { data, error }
  }
}

// Endorsements helpers
export const endorsements = {
  getPending: async (userId) => {
    const { data, error } = await supabase
      .from('endorsements')
      .select(`
        *,
        sender:profiles!endorsements_sender_id_fkey(username, full_name, avatar_url),
        trait:traits(word, category, color)
      `)
      .eq('receiver_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  create: async (endorsement) => {
    const { data, error } = await supabase
      .from('endorsements')
      .insert(endorsement)
      .select()
      .single()
    return { data, error }
  },

  updateStatus: async (endorsementId, status) => {
    const { data, error } = await supabase
      .from('endorsements')
      .update({ 
        status, 
        responded_at: new Date().toISOString() 
      })
      .eq('id', endorsementId)
      .select()
      .single()
    return { data, error }
  }
}

// Notifications helpers
export const notifications = {
  get: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)
    return { data, error }
  },

  markAsRead: async (notificationId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
    return { data, error }
  },

  markAllAsRead: async (userId) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
    return { data, error }
  }
}

// Besties helpers
export const besties = {
  get: async (userId) => {
    const { data, error } = await supabase
      .from('besties')
      .select(`
        *,
        bestie:profiles!besties_bestie_id_fkey(id, username, full_name, avatar_url)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
    return { data, error }
  },

  request: async (userId, bestieId) => {
    const { data, error } = await supabase
      .from('besties')
      .insert({ user_id: userId, bestie_id: bestieId })
      .select()
      .single()
    return { data, error }
  },

  updateStatus: async (requestId, status) => {
    const { data, error } = await supabase
      .from('besties')
      .update({ 
        status, 
        accepted_at: status === 'accepted' ? new Date().toISOString() : null 
      })
      .eq('id', requestId)
      .select()
      .single()
    return { data, error }
  }
}

// Storage helpers
export const storage = {
  uploadAvatar: async (file, userId) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })
    
    if (error) return { data: null, error }
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    return { data: { publicUrl }, error: null }
  }
}

// Realtime helpers
export const realtime = {
  subscribeToTraits: (userId, callback) => {
    return supabase
      .channel('traits')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'traits',
        filter: `target_user=eq.${userId}`
      }, callback)
      .subscribe()
  },

  subscribeToNotifications: (userId, callback) => {
    return supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}