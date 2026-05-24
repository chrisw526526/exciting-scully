module.exports = async function handler(req, res) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say the word WORKING and nothing else.' }]
      })
    });

    const data = await response.json();
    
    // Return the full raw response so we can see exactly what ESPN is sending
    return res.status(200).json({ 
      status: response.status,
      full_response: data
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
