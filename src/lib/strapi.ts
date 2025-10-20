/**
 * Strapi API client
 */

const STRAPI_URL = import.meta.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN || '';

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch data from Strapi API
 */
export async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api${path}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get all group organisers
 */
export async function getGroupOrganisers(params?: {
  page?: number;
  pageSize?: number;
  filters?: Record<string, any>;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.set('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.set(`filters[${key}]`, value);
    });
  }

  const query = searchParams.toString() ? `?${searchParams}` : '';
  return fetchAPI(`/group-organisers${query}`);
}

/**
 * Get a single group organiser by slug
 */
export async function getGroupOrganiserBySlug(slug: string) {
  return fetchAPI(`/group-organisers?filters[slug][$eq]=${slug}&populate=*`);
}

/**
 * Get a group organiser by ID
 */
export async function getGroupOrganiserById(id: string | number) {
  return fetchAPI(`/group-organisers/${id}?populate=*`);
}

