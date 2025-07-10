import { supabase } from './supabase'

class AITraitSuggestionEngine {
  constructor() {
    this.suggestionPool = [
      // Mind traits
      { word: 'creative', category: 'mind', keywords: ['art', 'design', 'innovative', 'original'] },
      { word: 'intelligent', category: 'mind', keywords: ['smart', 'clever', 'analytical', 'logical'] },
      { word: 'wise', category: 'mind', keywords: ['thoughtful', 'insightful', 'experienced'] },
      { word: 'curious', category: 'mind', keywords: ['learning', 'exploring', 'questioning'] },
      
      // Heart traits
      { word: 'kind', category: 'heart', keywords: ['caring', 'gentle', 'compassionate'] },
      { word: 'empathetic', category: 'heart', keywords: ['understanding', 'supportive', 'caring'] },
      { word: 'passionate', category: 'heart', keywords: ['enthusiastic', 'dedicated', 'driven'] },
      { word: 'genuine', category: 'heart', keywords: ['authentic', 'real', 'honest'] },
      
      // Social traits
      { word: 'funny', category: 'social', keywords: ['humor', 'jokes', 'entertaining'] },
      { word: 'charismatic', category: 'social', keywords: ['charming', 'magnetic', 'influential'] },
      { word: 'outgoing', category: 'social', keywords: ['social', 'extroverted', 'friendly'] },
      { word: 'inspiring', category: 'social', keywords: ['motivating', 'uplifting', 'encouraging'] }
    ]
  }

  // Generate suggestions based on user profile
  async generateSuggestions(userId) {
    try {
      const profile = await this.getUserProfile(userId)
      const existingTraits = await this.getExistingTraits(userId)
      const socialActivity = await this.getSocialActivity(userId)

      const suggestions = []

      // Bio-based suggestions
      if (profile.bio) {
        suggestions.push(...this.analyzeBio(profile.bio, existingTraits))
      }

      // Activity-based suggestions
      suggestions.push(...this.analyzeActivity(socialActivity, existingTraits))

      // Social graph suggestions
      suggestions.push(...this.analyzeSocialGraph(userId, existingTraits))

      // Store suggestions in database
      await this.storeSuggestions(userId, suggestions)

      return suggestions
    } catch (error) {
      console.error('Error generating AI suggestions:', error)
      return []
    }
  }

  // Analyze user bio for trait suggestions
  analyzeBio(bio, existingTraits) {
    const suggestions = []
    const bioLower = bio.toLowerCase()

    this.suggestionPool.forEach(trait => {
      if (existingTraits.includes(trait.word.toLowerCase())) return

      const keywordMatches = trait.keywords.filter(keyword => 
        bioLower.includes(keyword.toLowerCase())
      ).length

      if (keywordMatches > 0) {
        suggestions.push({
          trait: trait.word,
          category: trait.category,
          confidence: Math.min(0.9, 0.5 + (keywordMatches * 0.2)),
          reasoning: `Your bio mentions themes related to being ${trait.word}`,
          source: 'bio'
        })
      }
    })

    return suggestions
  }

  // Analyze user activity patterns
  analyzeActivity(activity, existingTraits) {
    const suggestions = []

    // Analyze traits user has given to others
    const givenTraits = activity.traitsGiven || []
    const traitFrequency = {}

    givenTraits.forEach(trait => {
      traitFrequency[trait] = (traitFrequency[trait] || 0) + 1
    })

    // Suggest traits user frequently gives to others
    Object.entries(traitFrequency).forEach(([trait, frequency]) => {
      if (existingTraits.includes(trait.toLowerCase())) return
      if (frequency >= 2) {
        suggestions.push({
          trait,
          category: this.getTraitCategory(trait),
          confidence: Math.min(0.8, 0.4 + (frequency * 0.1)),
          reasoning: `You often see "${trait}" in others - you might have this quality too`,
          source: 'activity'
        })
      }
    })

    return suggestions
  }

  // Analyze social connections
  analyzeSocialGraph(userId, existingTraits) {
    const suggestions = []

    // This would analyze mutual traits with friends
    // For now, return some general suggestions
    const commonTraits = ['reliable', 'supportive', 'thoughtful']

    commonTraits.forEach(trait => {
      if (!existingTraits.includes(trait.toLowerCase())) {
        suggestions.push({
          trait,
          category: this.getTraitCategory(trait),
          confidence: 0.6,
          reasoning: `Based on your social connections and interactions`,
          source: 'social_graph'
        })
      }
    })

    return suggestions
  }

  // Get trait category
  getTraitCategory(traitWord) {
    const trait = this.suggestionPool.find(t => 
      t.word.toLowerCase() === traitWord.toLowerCase()
    )
    return trait ? trait.category : 'general'
  }

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('bio, location, website')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data || {}
  }

  // Get existing traits
  async getExistingTraits(userId) {
    const { data, error } = await supabase
      .from('traits')
      .select('word')
      .eq('target_user', userId)
      .eq('status', 'approved')

    if (error) throw error
    return (data || []).map(t => t.word.toLowerCase())
  }

  // Get social activity
  async getSocialActivity(userId) {
    const { data, error } = await supabase
      .from('traits')
      .select('word')
      .eq('created_by', userId)
      .eq('status', 'approved')

    if (error) throw error
    return {
      traitsGiven: (data || []).map(t => t.word)
    }
  }

  // Store suggestions in database
  async storeSuggestions(userId, suggestions) {
    const records = suggestions.map(suggestion => ({
      user_id: userId,
      suggested_trait: suggestion.trait,
      confidence_score: suggestion.confidence,
      reasoning: suggestion.reasoning,
      source_type: suggestion.source
    }))

    const { error } = await supabase
      .from('ai_trait_suggestions')
      .insert(records)

    if (error) throw error
  }

  // Get stored suggestions for user
  async getSuggestions(userId) {
    const { data, error } = await supabase
      .from('ai_trait_suggestions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('confidence_score', { ascending: false })
      .limit(5)

    if (error) throw error
    return data || []
  }

  // Accept suggestion
  async acceptSuggestion(suggestionId) {
    const { error } = await supabase
      .from('ai_trait_suggestions')
      .update({ status: 'accepted', used_at: new Date().toISOString() })
      .eq('id', suggestionId)

    if (error) throw error
  }

  // Reject suggestion
  async rejectSuggestion(suggestionId) {
    const { error } = await supabase
      .from('ai_trait_suggestions')
      .update({ status: 'rejected' })
      .eq('id', suggestionId)

    if (error) throw error
  }
}

export const aiSuggestionEngine = new AITraitSuggestionEngine()