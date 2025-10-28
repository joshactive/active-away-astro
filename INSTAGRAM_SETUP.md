# Instagram Token Setup - Direct PostgreSQL Storage

## 📋 Overview
Instagram access token stored directly in PostgreSQL database.
**Token expires every 60 days** - auto-updated via make.com automation.

---

## 🗄️ Step 1: Create Database Table

Run this SQL in your Railway PostgreSQL database:

```sql
-- Create Instagram token table
CREATE TABLE IF NOT EXISTS instagram_tokens (
  id SERIAL PRIMARY KEY,
  access_token TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  notes TEXT
);

-- Insert initial record with your token
INSERT INTO instagram_tokens (access_token, expires_at, notes) 
VALUES (
  'YOUR_INSTAGRAM_ACCESS_TOKEN_HERE',
  CURRENT_TIMESTAMP + INTERVAL '60 days',
  'Instagram access token - auto-updated by make.com every 60 days'
);

-- Auto-update timestamp on token change
CREATE OR REPLACE FUNCTION update_instagram_token_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS instagram_token_updated ON instagram_tokens;
CREATE TRIGGER instagram_token_updated
  BEFORE UPDATE ON instagram_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_instagram_token_timestamp();
```

### How to Run:
1. Go to **Railway** → Your Strapi project → **PostgreSQL**
2. Click **Connect** → Copy the connection string
3. Use a tool like **pgAdmin** or **psql** to connect
4. Run the SQL above
5. Replace `YOUR_INSTAGRAM_ACCESS_TOKEN_HERE` with your actual token

---

## 🔧 Step 2: Install pg Package

```bash
cd /Users/joshuathompson/active-away-astro
npm install pg
```

---

## 🌐 Step 3: Add DATABASE_URL to Environment

### Local (.env):
```env
DATABASE_URL=postgresql://username:password@hostname:port/database
```

### Railway (Astro App):
Add environment variable:
- Name: `DATABASE_URL`
- Value: (same as your Strapi database URL)

---

## 🤖 Step 4: make.com Automation (Update Token Every 60 Days)

### ✅ API Endpoint Created!

**Endpoint:** `POST /api/update-instagram-token.json`

**Your Secret Key:**
```
d9bb6046efb2e4565ed22cd58a0e90113246d8de9a389f2d967546be4066c581
```

### 🔧 make.com Scenario Setup:

#### **Module 1: Schedule**
- **Trigger:** Every 60 days (or 55 days to be safe)
- **Start:** Set to your token's expiry date

#### **Module 2: Get New Instagram Token**
Use Instagram Graph API to refresh your token:
- **Method:** GET
- **URL:** 
  ```
  https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token={{current_token}}
  ```
- This returns a new long-lived token (60 days)

#### **Module 3: HTTP - Update Database**
- **Method:** POST
- **URL:** `https://activeaway.com/api/update-instagram-token.json`
- **Headers:**
  ```json
  {
    "Content-Type": "application/json"
  }
  ```
- **Body:**
  ```json
  {
    "token": "{{new_token_from_module_2}}",
    "secret": "d9bb6046efb2e4565ed22cd58a0e90113246d8de9a389f2d967546be4066c581"
  }
  ```

#### **Module 4: Error Handler (Optional)**
- Send email notification if token update fails

### 🧪 Test the Endpoint:

```bash
curl -X POST https://activeaway.com/api/update-instagram-token.json \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_NEW_TOKEN",
    "secret": "d9bb6046efb2e4565ed22cd58a0e90113246d8de9a389f2d967546be4066c581"
  }'
```

### ✨ What the Endpoint Does:

1. ✅ **Validates** the secret key
2. ✅ **Tests** the new token with Instagram API
3. ✅ **Updates** the database with new token
4. ✅ **Sets** expiry date to 60 days from now
5. ✅ **Returns** success confirmation with account username

---

## 🎨 Step 5: Use in Your Frontend

```astro
---
import { getInstagramPosts } from '../utils/instagram.js';

const instagramPosts = await getInstagramPosts(6);
---

<section>
  {instagramPosts.map(post => (
    <a href={post.permalink} target="_blank">
      <img src={post.media_url} alt={post.caption} />
    </a>
  ))}
</section>
```

---

## 📊 Verify Token in Database

```sql
-- Check current token and expiry
SELECT 
  id,
  LEFT(access_token, 20) || '...' as token_preview,
  updated_at,
  expires_at,
  notes
FROM instagram_tokens
ORDER BY id DESC
LIMIT 1;
```

---

## ✅ Benefits of This Approach

✅ **No code deploys** when token changes  
✅ **Secure** - token not in environment variables  
✅ **Automated** - make.com updates every 60 days  
✅ **Simple** - direct database access  
✅ **Trackable** - timestamps show when token was updated  

Done! 🎉

