
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const japApiKey = Deno.env.get('JAP_API_KEY')
    
    if (!japApiKey) {
      return new Response(
        JSON.stringify({ error: 'JAP API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action') || 'services'

    // Prepare form data for JustAnotherPanel API
    const formData = new FormData()
    formData.append('key', japApiKey)
    formData.append('action', action)

    // Add additional parameters based on action
    if (action === 'add') {
      const body = await req.json()
      formData.append('service', body.service.toString())
      formData.append('link', body.link)
      formData.append('quantity', body.quantity.toString())
    } else if (action === 'status') {
      const body = await req.json()
      formData.append('order', body.order.toString())
    }

    // Make request to JustAnotherPanel API
    const response = await fetch('https://justanotherpanel.com/api/v2', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`JAP API request failed: ${response.statusText}`)
    }

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('JAP API Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
