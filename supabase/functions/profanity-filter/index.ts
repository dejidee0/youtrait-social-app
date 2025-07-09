import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Basic profanity word list (extend as needed)
const bannedWords = [
  'spam', 'hate', 'abuse', 'offensive', 'inappropriate',
  // Add more banned words as needed
]

interface FilterRequest {
  text: string
  type: 'trait' | 'message' | 'bio'
}

interface FilterResponse {
  isClean: boolean
  filteredText: string
  flaggedWords: string[]
}

function containsProfanity(text: string): { isClean: boolean; flaggedWords: string[] } {
  const lowerText = text.toLowerCase()
  const flaggedWords: string[] = []
  
  for (const word of bannedWords) {
    if (lowerText.includes(word.toLowerCase())) {
      flaggedWords.push(word)
    }
  }
  
  return {
    isClean: flaggedWords.length === 0,
    flaggedWords
  }
}

function filterText(text: string, flaggedWords: string[]): string {
  let filtered = text
  
  for (const word of flaggedWords) {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, '*'.repeat(word.length))
  }
  
  return filtered
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, type }: FilterRequest = await req.json()
    
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Text is required and must be a string' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check for profanity
    const { isClean, flaggedWords } = containsProfanity(text)
    
    // Filter the text if needed
    const filteredText = isClean ? text : filterText(text, flaggedWords)
    
    const response: FilterResponse = {
      isClean,
      filteredText,
      flaggedWords
    }

    // Log for monitoring (in production, use proper logging)
    if (!isClean) {
      console.log(`Profanity detected in ${type}:`, {
        originalText: text,
        flaggedWords,
        timestamp: new Date().toISOString()
      })
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Error in profanity filter:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        isClean: false,
        filteredText: '',
        flaggedWords: []
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})