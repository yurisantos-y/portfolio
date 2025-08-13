# Environment Setup Guide

## Fix CORS and Supabase Issues

To resolve the CORS errors and Supabase authentication issues, you need to create a `.env` file with your Supabase credentials.

### Steps:

1. **Create a `.env` file in the root of your project** (do NOT commit it):
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_KEY=your_supabase_anon_key_here
   VITE_SITE_URL=http://localhost:5173
   VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
   # DO NOT put Unsplash secret key here for frontend; keep it only in a backend service if required
   ```

2. **Get your Supabase credentials**:
   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings → API
   - Copy the "URL" and "anon public" key

3. **Configure Supabase Authentication**:
   - In your Supabase Dashboard, go to Authentication → Settings
   - Add your site URL to "Site URL": `http://localhost:5173` (for development)
   - Add redirect URLs if needed

4. **For production deployment**:
   - Update the Site URL to your production domain
   - Add production URLs to redirect URLs

### Security Notes:

❗ Never expose service_role or Unsplash secret in the browser.
Use only anon public key on client. Rotate any leaked keys immediately in Supabase dashboard.

### What was fixed:

✅ **Multiple GoTrueClient instances**: Consolidated to single Supabase client
✅ **Missing `portugueseChecked` property**: Added as computed property
✅ **Template issues**: Removed duplicate checkbox inputs
✅ **Import consistency**: Updated all files to use the same client

### Running the project:

```bash
npm install
npm run dev
```

The application will now handle missing environment variables gracefully with a mock client during development.
