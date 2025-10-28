import type { APIRoute } from 'astro';
import pg from 'pg';
const { Client } = pg;

/**
 * API Endpoint to update Instagram access token
 * Called by make.com automation every 60 days
 * 
 * Usage:
 * POST /api/update-instagram-token.json
 * Body: {
 *   "token": "NEW_INSTAGRAM_TOKEN",
 *   "secret": "YOUR_SECRET_KEY"
 * }
 */
export const POST: APIRoute = async ({ request }) => {
  const SECRET_KEY = import.meta.env.INSTAGRAM_UPDATE_SECRET;
  const DATABASE_URL = import.meta.env.DATABASE_URL;
  
  if (!DATABASE_URL) {
    return new Response(JSON.stringify({ 
      error: 'Database configuration missing' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { token, secret } = body;
    
    // Verify secret key
    if (!SECRET_KEY || secret !== SECRET_KEY) {
      console.warn('⚠️  Unauthorized Instagram token update attempt');
      return new Response(JSON.stringify({ 
        error: 'Unauthorized' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate token format
    if (!token || typeof token !== 'string' || token.length < 20) {
      return new Response(JSON.stringify({ 
        error: 'Invalid token format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Test token with Instagram API before saving
    console.log('🔍 Testing new Instagram token...');
    const testResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username&access_token=${token}`
    );

    if (!testResponse.ok) {
      const error = await testResponse.json();
      console.error('❌ Invalid Instagram token:', error);
      return new Response(JSON.stringify({ 
        error: 'Invalid Instagram token',
        details: error
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const instagramData = await testResponse.json();
    console.log('✅ Token validated for account:', instagramData.username);

    // Update database
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
    });

    await client.connect();
    
    const result = await client.query(
      `UPDATE instagram_tokens 
       SET access_token = $1,
           expires_at = CURRENT_TIMESTAMP + INTERVAL '60 days',
           notes = $2
       WHERE id = 1
       RETURNING id, updated_at, expires_at`,
      [token, `Auto-updated by make.com for @${instagramData.username}`]
    );

    await client.end();

    if (result.rowCount === 0) {
      // No row found, insert new one
      const insertClient = new Client({
        connectionString: DATABASE_URL,
        ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
      });

      await insertClient.connect();
      
      await insertClient.query(
        `INSERT INTO instagram_tokens (access_token, expires_at, notes)
         VALUES ($1, CURRENT_TIMESTAMP + INTERVAL '60 days', $2)`,
        [token, `Auto-updated by make.com for @${instagramData.username}`]
      );

      await insertClient.end();
      console.log('✅ Instagram token inserted');
    } else {
      console.log('✅ Instagram token updated');
    }

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Instagram token updated successfully',
      account: instagramData.username,
      updated_at: result.rows[0]?.updated_at,
      expires_at: result.rows[0]?.expires_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error updating Instagram token:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to update token',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

