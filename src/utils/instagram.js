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

// In-memory cache to prevent multiple DB/API calls during build
let cachedToken = null;
let tokenFetchPromise = null;
let cachedPosts = null;
let postsFetchPromise = null;

/**
 * Fetch Instagram access token from PostgreSQL
 * @returns {Promise<string|null>} Instagram access token
 */
export async function getInstagramToken() {
  // Return cached token if available
  if (cachedToken) return cachedToken;

  // If a fetch is already in progress, return that promise
  if (tokenFetchPromise) return tokenFetchPromise;

  // Start new fetch
  tokenFetchPromise = (async () => {
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
        cachedToken = result.rows[0].access_token;
        return cachedToken;
      } else {
        console.warn('⚠️  No Instagram token found in database');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching Instagram token:', error);
      return null;
    } finally {
      await client.end();
      tokenFetchPromise = null; // Clear promise after completion
    }
  })();

  return tokenFetchPromise;
}

/**
 * Fetch Instagram posts
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of Instagram posts
 */
export async function getInstagramPosts(limit = 6) {
  // Return cached posts if available and we have enough
  if (cachedPosts && cachedPosts.length >= limit) {
    return cachedPosts.slice(0, limit);
  }

  // If a fetch is already in progress, reuse it
  if (postsFetchPromise) {
    const posts = await postsFetchPromise;
    return posts.slice(0, limit);
  }

  postsFetchPromise = (async () => {
    try {
      const token = await getInstagramToken();
      
      if (!token) {
        console.error('❌ No Instagram token available');
        return [];
      }

      const fields = 'id,caption,media_type,media_url,permalink,timestamp,thumbnail_url,children{media_url,media_type,thumbnail_url}';
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=${20}` // Fetch more to cache
      );

      if (!response.ok) {
        console.error('❌ Instagram API error:', response.status);
        return [];
      }

      const data = await response.json();
      console.log(`✅ Fetched ${data.data?.length || 0} Instagram posts`);

      // Process posts to handle carousels
      const posts = (data.data || []).map(post => {
        // If it's a carousel, use the first child's media
        if (post.media_type === 'CAROUSEL_ALBUM' && post.children?.data?.length > 0) {
          const firstChild = post.children.data[0];
          return {
            ...post,
            media_url: firstChild.media_url || post.media_url,
            thumbnail_url: firstChild.thumbnail_url || post.thumbnail_url,
            media_type: firstChild.media_type || 'IMAGE'
          };
        }
        return post;
      });

      cachedPosts = posts;
      return posts;
    } catch (error) {
      console.error('❌ Error fetching Instagram posts:', error);
      return [];
    } finally {
      postsFetchPromise = null;
    }
  })();

  const allPosts = await postsFetchPromise;
  return allPosts.slice(0, limit);
}
