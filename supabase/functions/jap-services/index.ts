
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
      console.error('JAP_API_KEY not found in environment')
      return new Response(
        JSON.stringify({ error: 'JAP API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const body = await req.json().catch(() => ({}))
    const action = body.action || 'services'

    console.log('JAP API Request:', { action, body })

    // Prepare form data for JustAnotherPanel API
    const formData = new FormData()
    formData.append('key', japApiKey)
    formData.append('action', action)

    // Add additional parameters based on action
    if (action === 'add') {
      formData.append('service', body.service.toString())
      formData.append('link', body.link)
      formData.append('quantity', body.quantity.toString())
    } else if (action === 'status') {
      formData.append('order', body.order.toString())
    }

    console.log('Making request to JAP API with action:', action)

    // Make request to JustAnotherPanel API
    const response = await fetch('https://justanotherpanel.com/api/v2', {
      method: 'POST',
      body: formData,
    })

    const responseText = await response.text()
    console.log('JAP API Response:', responseText)

    if (!response.ok) {
      throw new Error(`JAP API request failed: ${response.status} ${response.statusText}`)
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      console.error('Failed to parse JAP response as JSON:', responseText)
      throw new Error(`Invalid JSON response from JAP API: ${responseText}`)
    }

    console.log('Parsed JAP data:', data)

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
