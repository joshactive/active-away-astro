# Active Away - Astro Frontend

Astro frontend for Active Away, connected to Strapi CMS backend.

## 🚀 Quick Start

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.dev.vars` file with your Strapi credentials:
   ```
   STRAPI_URL=https://your-strapi-app.railway.app
   STRAPI_API_TOKEN=your_api_token_here
   ```

3. **Start dev server**:
   ```bash
   npm run dev
   ```

   Visit `http://localhost:4321`

## 📦 Project Structure

```
/
├── public/             # Static assets
├── src/
│   ├── components/     # Astro components
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routes
│   └── lib/
│       └── strapi.ts   # Strapi API client
├── astro.config.mjs    # Astro configuration
└── package.json
```

## 🌐 Deployment to Cloudflare Pages

### Via Cloudflare Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** → **Create application** → **Pages**
   - Connect your GitHub repository
   - Configure build settings:
     - **Framework preset**: Astro
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`

3. **Add Environment Variables**:
   - In Cloudflare Pages settings → **Environment variables**
   - Add:
     - `STRAPI_URL`: Your Railway Strapi URL (e.g., `https://your-app.railway.app`)
     - `STRAPI_API_TOKEN`: Your Strapi API token

4. **Deploy**: Click "Save and Deploy"

### Via Wrangler CLI (Alternative)

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run build
wrangler pages deploy dist
```

## 🔗 Strapi API Integration

The Strapi client is located in `src/lib/strapi.ts` and provides:

- `getGroupOrganisers()` - Fetch all group organisers
- `getGroupOrganiserBySlug(slug)` - Fetch by slug
- `getGroupOrganiserById(id)` - Fetch by ID

### Example Usage

```astro
---
import { getGroupOrganisers } from '../lib/strapi';

const { data: organisers } = await getGroupOrganisers({
  pageSize: 10,
  filters: { countryMaster: 'Spain' }
});
---

<div>
  {organisers.map(organiser => (
    <h2>{organiser.attributes.title}</h2>
  ))}
</div>
```

## 🛠️ Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run astro` - Run Astro CLI commands

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Strapi Documentation](https://docs.strapi.io)
