import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

// Auth Store
export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  
  logout: () => set({ user: null, profile: null, loading: false })
}))

// Traits Store
export const useTraitsStore = create(
  subscribeWithSelector((set, get) => ({
    traits: [],
    loading: false,
    error: null,
    
    setTraits: (traits) => set({ traits }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    
    addTrait: (trait) => set((state) => ({
      traits: [...state.traits, trait]
    })),
    
    updateTrait: (traitId, updates) => set((state) => ({
      traits: state.traits.map(trait => 
        trait.id === traitId ? { ...trait, ...updates } : trait
      )
    })),
    
    removeTrait: (traitId) => set((state) => ({
      traits: state.traits.filter(trait => trait.id !== traitId)
    })),
    
    upvoteTrait: (traitId) => set((state) => ({
      traits: state.traits.map(trait => 
        trait.id === traitId 
          ? { ...trait, upvotes: trait.upvotes + 1 }
          : trait
      )
    }))
  }))
)

// Notifications Store
export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  
  setNotifications: (notifications) => {
    const unreadCount = notifications.filter(n => !n.read).length
    set({ notifications, unreadCount })
  },
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + (notification.read ? 0 : 1)
  })),
  
  markAsRead: (notificationId) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  setLoading: (loading) => set({ loading })
}))

// Approval Inbox Store
export const useApprovalStore = create((set, get) => ({
  pendingEndorsements: [],
  loading: false,
  
  setPendingEndorsements: (endorsements) => set({ pendingEndorsements: endorsements }),
  setLoading: (loading) => set({ loading }),
  
  addEndorsement: (endorsement) => set((state) => ({
    pendingEndorsements: [endorsement, ...state.pendingEndorsements]
  })),
  
  removeEndorsement: (endorsementId) => set((state) => ({
    pendingEndorsements: state.pendingEndorsements.filter(e => e.id !== endorsementId)
  })),
  
  updateEndorsementStatus: (endorsementId, status) => set((state) => ({
    pendingEndorsements: state.pendingEndorsements.filter(e => e.id !== endorsementId)
  }))
}))

// Besties Store
export const useBestiesStore = create((set, get) => ({
  besties: [],
  pendingRequests: [],
  loading: false,
  
  setBesties: (besties) => set({ besties }),
  setPendingRequests: (requests) => set({ pendingRequests: requests }),
  setLoading: (loading) => set({ loading }),
  
  addBestie: (bestie) => set((state) => ({
    besties: [...state.besties, bestie]
  })),
  
  removeBestie: (bestieId) => set((state) => ({
    besties: state.besties.filter(b => b.id !== bestieId)
  }))
}))

// UI Store
export const useUIStore = create((set, get) => ({
  sidebarOpen: false,
  currentModal: null,
  theme: 'dark',
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentModal: (modal) => set({ currentModal: modal }),
  setTheme: (theme) => set({ theme }),
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeModal: () => set({ currentModal: null })
}))

// Stats Store
export const useStatsStore = create((set, get) => ({
  stats: {
    totalTraits: 0,
    approvedTraits: 0,
    pendingTraits: 0,
    totalUpvotes: 0,
    traitsGiven: 0
  },
  loading: false,
  
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  
  updateStat: (key, value) => set((state) => ({
    stats: { ...state.stats, [key]: value }
  }))
}))