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
    const { query } = event.queryStringParameters;
    
    const response = await fetch(
      `https://lyjjfgogmsoevlungvmt.supabase.co/rest/v1/users?phone_number=ilike.%25${encodeURIComponent(query)}%25`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI'
        }
      }
    );

    const users = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, users })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
}