/**
 * Instagram Token Management
 * Token stored directly in PostgreSQL database
 * Updated every 60 days via make.com automation
 */

import pg from 'pg';
const { Client } = pg;

// Get database URL from environment
const DATABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.DATABASE_URL) 
  || process.env.DATABASE_URL 
  || '';

/**
 * Fetch Instagram access token from PostgreSQL
 * @returns {Promise<string|null>} Instagram access token
 */
export async function getInstagramToken() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: DATABASE_URL.includes('railway') ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    
    const result = await client.query(
      'SELECT access_token FROM instagram_tokens ORDER BY id DESC LIMIT 1'
    );

    if (result.rows.length > 0) {
      console.log('✅ Instagram token fetched from database');
      return result.rows[0].access_token;
    } else {
      console.warn('⚠️  No Instagram token found in database');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching Instagram token:', error);
    return null;
  } finally {
    await client.end();
  }
}

/**
 * Fetch Instagram posts
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of Instagram posts
 */
export async function getInstagramPosts(limit = 6) {
  try {
    const token = await getInstagramToken();
    
    if (!token) {
      console.error('❌ No Instagram token available');
      return [];
    }

    const fields = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url';
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=${limit}`
    );

    if (!response.ok) {
      console.error('❌ Instagram API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log(`✅ Fetched ${data.data?.length || 0} Instagram posts`);

    return data.data || [];
  } catch (error) {
    console.error('❌ Error fetching Instagram posts:', error);
    return [];
  }
}

