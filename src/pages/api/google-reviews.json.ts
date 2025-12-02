import type { APIRoute } from 'astro';
import { getReviews } from '../../utils/strapi';


// Helper function to format relative time
function getRelativeTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'Just now';
}

export const GET: APIRoute = async ({ locals, request }) => {
  try {
    // 1. Call getReviews from strapi.js
    const reviewsData = await getReviews();

    // 2. Filter out reviews with no content, then map fields
    const reviews = reviewsData
      .filter((review: any) => {
        const attrs = review.attributes || review;
        return attrs.content && attrs.content.trim().length > 0;
      })
      .map((review: any) => {
        const attrs = review.attributes || review; // Handle Strapi v4/v5 potentially
        
        // Logos
        let logoUrl = '';
        const source = attrs.reviewSource || '';
        if (source && source.toLowerCase().includes('google')) {
            logoUrl = 'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/415213dc-060c-4c99-56c2-e86d4c988100/public?width=64&height=32&fit=contain&format=auto&quality=85';
        } else if (source && source.toLowerCase().includes('trustpilot')) {
            logoUrl = 'https://activeaway.com/cdn-cgi/imagedelivery/-aT8Z2F9gGvZ9fdofZcCaQ/1cb7840e-0b3d-4b60-72f8-4b5152b3c900/public?width=64&height=32&fit=contain&format=auto&quality=85';
        }

        return {
          id: review.id,
          name: attrs.reviewName || 'Anonymous',
          date: getRelativeTime(attrs.reviewDate),
          rating: attrs.reviewRating || 5,
          text: attrs.content || '',
          avatar: null,
          publishTime: attrs.reviewDate,
          source: source,
          sourceUrl: attrs.reviewUrl,
          logoUrl: logoUrl
        };
      });

    // Calculate aggregate
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? reviews.reduce((acc: number, r: any) => acc + (r.rating || 0), 0) / totalReviews 
      : 5;

    return new Response(JSON.stringify({
      reviews,
      placeInfo: {
        name: 'Active Away',
        rating: avgRating,
        totalReviews: totalReviews
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch reviews',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
