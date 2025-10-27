export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { chatId } = event.queryStringParameters;
    
    // Получаем сообщения из Supabase
    const response = await fetch(
      `https://lyjjfgogmsoevlungvmt.supabase.co/rest/v1/messages?chat_id=eq.${chatId}&order=created_at.asc`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI'
        }
      }
    );

    const messages = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messages })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}