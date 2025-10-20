/**
 * Strapi API client
 */

type StrapiCredentials = {
  STRAPI_URL?: string;
  STRAPI_API_TOKEN?: string;
};

function resolveCredentials(credentials?: StrapiCredentials) {
  return {
    url: credentials?.STRAPI_URL || import.meta.env.STRAPI_URL || 'http://localhost:1337',
    token: credentials?.STRAPI_API_TOKEN || import.meta.env.STRAPI_API_TOKEN || '',
  };
}

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
  options: RequestInit = {},
  credentials?: StrapiCredentials,
): Promise<StrapiResponse<T>> {
  const { url, token } = resolveCredentials(credentials);
  const endpoint = `${url}/api${path}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(endpoint, {
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
export async function getGroupOrganisers(
  params?: {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
  },
  credentials?: StrapiCredentials,
) {
  const searchParams = new URLSearchParams();

  if (params?.page) searchParams.set('pagination[page]', params.page.toString());
  if (params?.pageSize) searchParams.set('pagination[pageSize]', params.pageSize.toString());
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      searchParams.set(`filters[${key}]`, value);
    });
  }

  const query = searchParams.toString() ? `?${searchParams}` : '';
  return fetchAPI(`/group-organisers${query}`, {}, credentials);
}

/**
 * Get a single group organiser by slug
 */
export async function getGroupOrganiserBySlug(slug: string, credentials?: StrapiCredentials) {
  return fetchAPI(`/group-organisers?filters[slug][$eq]=${slug}&populate=*`, {}, credentials);
}

/**
 * Get a group organiser by ID
 */
export async function getGroupOrganiserById(
  id: string | number,
  credentials?: StrapiCredentials,
) {
  return fetchAPI(`/group-organisers/${id}?populate=*`, {}, credentials);
}

export type { StrapiCredentials };
