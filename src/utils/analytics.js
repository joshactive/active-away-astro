/**
 * Analytics Utility
 * Handles tracking events across Google Analytics 4, Meta Pixel, Moosend, and Server-Side API (CAPI)
 */

// Helper to generate unique Event ID for deduplication
function generateEventId() {
  return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Track an event
 * @param {string} eventName - The name of the event (e.g., 'Purchase', 'Lead', 'Contact')
 * @param {object} params - Event parameters (e.g., value, currency, content_name)
 * @param {object} userData - User data for Advanced Matching (email, phone, etc.)
 */
export async function trackEvent(eventName, params = {}, userData = {}) {
  const eventId = generateEventId();
  
  // 1. Google Analytics 4
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
    console.log('📊 GA4 Event tracked:', eventName, params);
  }

  // 2. Meta Pixel (Browser Side)
  if (typeof window.fbq === 'function') {
    // Map standard GA4 events to Meta Pixel events if needed, or pass through
    // For now, we'll just pass through standard names or custom ones
    
    // Add Event ID for deduplication
    const pixelParams = { ...params, eventID: eventId };
    
    window.fbq('track', eventName, pixelParams, { eventID: eventId });
    console.log('📊 Meta Pixel Event tracked:', eventName, pixelParams);
  }

  // 3. Moosend
  if (typeof window.mootrack === 'function') {
    // Identify user if email is provided
    if (userData.email) {
      const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
      if (fullName) {
        window.mootrack('identify', userData.email, fullName);
        console.log('📊 Moosend user identified:', userData.email, fullName);
      } else {
        window.mootrack('identify', userData.email);
        console.log('📊 Moosend user identified:', userData.email);
      }
    }
    
    // Track custom event with params
    window.mootrack(eventName, params);
    console.log('📊 Moosend Event tracked:', eventName, params);
  }

  // 4. Meta Conversions API (Server Side)
  // We send this to our own API endpoint which forwards to Meta
  try {
    // Check if we have consent for marketing (Meta)
    const consent = JSON.parse(localStorage.getItem('active_away_cookie_consent') || '{}');
    if (consent.marketing) {
      const payload = {
        eventName,
        eventId,
        eventTime: Math.floor(Date.now() / 1000),
        eventSourceUrl: window.location.href,
        userData: userData, // Should be raw here, server will hash
        customData: params
      };

      // Fire and forget - don't await unless necessary
      fetch('/api/track-conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).catch(err => console.error('❌ CAPI Error:', err));
      
      console.log('📊 CAPI Event sent:', eventName);
    }
  } catch (e) {
    console.error('Error sending CAPI event:', e);
  }
}

/**
 * Track a Page View (automatically handled by scripts, but useful for SPA transitions if needed)
 */
export function trackPageView() {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view');
  }
  if (typeof window.fbq === 'function') {
    const eventId = generateEventId();
    window.fbq('track', 'PageView', {}, { eventID: eventId });
    
    // Also send CAPI PageView? Usually not needed if browser pixel is reliable for page views, 
    // but good for complete coverage. skipping for now to save quota/complexity.
  }
  if (typeof window.mootrack === 'function') {
    window.mootrack('trackPageView');
  }
}

