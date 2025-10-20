# Deploying to Cloudflare Pages

## Step-by-Step Guide

### 1. Get Your Strapi Railway URL

Your Strapi backend is already deployed on Railway. You'll need:
- **Railway URL**: `https://your-app-name.railway.app` (or your custom domain)
- **API Token**: The token you created in Strapi admin

### 2. Update .dev.vars for Local Development

Copy the sample file and fill in your Strapi details (the `.dev.vars` file is
ignored by git so your secrets stay local):

```bash
cp .dev.vars.example .dev.vars

# then edit the new .dev.vars file
STRAPI_URL=https://your-railway-app.railway.app
STRAPI_API_TOKEN=your_api_token_here
```

Test locally:
```bash
npm run dev
```

Visit `http://localhost:4321` - you should see your group organisers!

### 3. Push to GitHub

```bash
cd /Users/joshuathompson/Desktop/active-away-astro
git init
git add .
git commit -m "Initial commit: Astro + Strapi integration"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/yourusername/active-away-astro.git
git branch -M main
git push -u origin main
```

### 4. Deploy to Cloudflare Pages

#### Option A: Via Cloudflare Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**:
   - Visit https://dash.cloudflare.com/
   - Navigate to **Workers & Pages**

2. **Create Pages Project**:
   - Click **Create application** → **Pages** → **Connect to Git**
   - Select your GitHub repository
   - Click **Begin setup**

3. **Configure Build Settings**:
   - **Project name**: `active-away` (or your choice)
   - **Production branch**: `main`
   - **Framework preset**: **Astro**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

4. **Add Environment Variables**:
   Click **Environment variables (advanced)**:
   - Variable name: `STRAPI_URL`
     Value: `https://your-railway-app.railway.app`
   - Variable name: `STRAPI_API_TOKEN`
     Value: Your Strapi API token

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait 2-3 minutes for build to complete
   - Your site will be live at `https://active-away.pages.dev`

#### Option B: Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build your site
npm run build

# Deploy
wrangler pages deploy dist --project-name=active-away

# Set environment variables
wrangler pages secret put STRAPI_URL
# Enter: https://your-railway-app.railway.app

wrangler pages secret put STRAPI_API_TOKEN
# Enter: your_api_token_here
```

### 5. Set Up Custom Domain (Optional)

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add your domain (e.g., `activeaway.com`)
4. Follow DNS instructions
5. Wait for SSL certificate (automatic)

## Continuous Deployment

Every push to your `main` branch will automatically trigger a new deployment on Cloudflare Pages!

```bash
# Make changes
git add .
git commit -m "Update content"
git push

# Cloudflare Pages will automatically deploy!
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `STRAPI_URL` | Your Strapi backend URL | `https://strapi.railway.app` |
| `STRAPI_API_TOKEN` | Strapi API authentication token | `abc123...` |

## Troubleshooting

### "Error connecting to Strapi"
- Check that `STRAPI_URL` is correct in Cloudflare Pages env vars
- Verify your Strapi API token is valid
- Ensure Strapi API permissions are enabled for the content types

### Build fails on Cloudflare
- Check build logs in Cloudflare Pages dashboard
- Verify `npm run build` works locally
- Ensure all dependencies are in `package.json`

### CORS errors
Add this to your Strapi `config/middlewares.js`:
```javascript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://active-away.pages.dev', 'https://yourdomain.com'],
  },
}
```

## Next Steps

1. **Add more pages**: Create pages in `src/pages/` for tennis holidays, etc.
2. **Style your site**: Add Tailwind CSS: `npx astro add tailwind`
3. **Add SEO**: Use Astro's built-in SEO features
4. **Add React/Vue**: If needed: `npx astro add react`

## Useful Links

- [Astro Docs](https://docs.astro.build)
- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Strapi API Docs](https://docs.strapi.io/dev-docs/api/rest)

