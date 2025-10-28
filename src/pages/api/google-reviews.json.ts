import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  const runtimeEnv = locals.runtime?.env || {};

  const GOOGLE_API_KEY = runtimeEnv.GOOGLE_PLACES_API_KEY || import.meta.env.GOOGLE_PLACES_API_KEY || '';
  const PLACE_ID = runtimeEnv.GOOGLE_PLACE_ID || import.meta.env.GOOGLE_PLACE_ID || 'ChIJ6aLvHHgPdkgR1oHhIDyNQtU';

  console.log('[reviews] env key prefix:', GOOGLE_API_KEY ? GOOGLE_API_KEY.slice(0, 6) : 'undefined');
  console.log('[reviews] env place id:', PLACE_ID || 'undefined');

  // Debug logging
  console.log('🔍 Environment check:', {
    hasApiKey: !!GOOGLE_API_KEY,
    apiKeyLength: GOOGLE_API_KEY?.length || 0,
    apiKeyPrefix: GOOGLE_API_KEY?.substring(0, 10) || 'none',
    placeId: PLACE_ID,
    allEnvKeys: Object.keys(import.meta.env).filter(k => k.includes('GOOGLE'))
  });

  if (!GOOGLE_API_KEY) {
    console.error('❌ Google Places API key not found');
    console.error('Available env vars:', Object.keys(import.meta.env));
    return new Response(JSON.stringify({ 
      error: 'API key not configured',
      debug: {
        availableVars: Object.keys(import.meta.env).filter(k => !k.includes('SECRET'))
      }
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Use the new Google Places API
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=displayName,rating,reviews,userRatingCount&languageCode=en`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': GOOGLE_API_KEY,
          'X-Goog-FieldMask': 'displayName,rating,reviews,userRatingCount'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error:', response.status, errorText);
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();

    // Format reviews for frontend
    const allReviews = data.reviews?.map((review: any, index: number) => ({
      id: review.relativePublishTimeDescription || index,
      name: review.authorAttribution?.displayName || 'Anonymous',
      date: review.relativePublishTimeDescription || '',
      rating: review.rating || 5,
      text: review.text?.text || review.originalText?.text || '',
      avatar: review.authorAttribution?.photoUri || 'https://via.placeholder.com/48',
      publishTime: review.publishTime
    })) || [];

    // Filter for 5-star reviews only and sort by most recent
    const reviews = allReviews
      .filter(review => review.rating === 5)
      .sort((a, b) => {
        // Sort by publishTime (most recent first)
        return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
      })
      .slice(0, 20); // Limit to 20 most recent 5-star reviews

    return new Response(JSON.stringify({
      reviews,
      placeInfo: {
        name: data.displayName?.text || 'Active Away',
        rating: data.rating || 5,
        totalReviews: data.userRatingCount || 0
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    });

  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
