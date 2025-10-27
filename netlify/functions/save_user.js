export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: 'Method Not Allowed' };
  }

  try {
    const { phoneNumber } = JSON.parse(event.body);
    
    // Сначала проверяем существует ли пользователь
    const checkResponse = await fetch(
      `https://lyjjfgogmsoevlungvmt.supabase.co/rest/v1/users?phone_number=eq.${phoneNumber}`,
      {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI'
        }
      }
    );

    const existingUsers = await checkResponse.json();
    
    let user;
    if (existingUsers.length > 0) {
      // Пользователь уже существует
      user = existingUsers[0];
    } else {
      // Создаем нового пользователя
      const createResponse = await fetch('https://lyjjfgogmsoevlungvmt.supabase.co/rest/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5ampmZ29nbXNvZXZsdW5ndm10Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODg3NjMsImV4cCI6MjA3NzE2NDc2M30.31sOhvQX8ebaUM-7qxs-JuX7LO3R-d1j2w7mZC5GHaI',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          username: 'user_' + Date.now()
        })
      });
      
      const newUsers = await createResponse.json();
      user = newUsers[0];
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, user })
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