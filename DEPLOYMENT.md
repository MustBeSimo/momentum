# Deployment Guide - Upraze

## Deploy to Vercel

### Prerequisites
- GitHub account with the Upraze repository
- Vercel account (free tier available)

### Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial Upraze PWA implementation"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `momentum` repository
   - Set the root directory to `upraze`
   - Click "Deploy"

3. **Configure Environment Variables** (for future integrations)
   ```bash
   # In Vercel dashboard > Settings > Environment Variables
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Custom Domain** (optional)
   - In Vercel dashboard > Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

### PWA Configuration

The app is already configured as a PWA with:
- ✅ Manifest file (`/public/manifest.json`)
- ✅ Service worker (`/public/sw.js`)
- ✅ Icons (SVG placeholders)
- ✅ Meta tags for mobile apps

### Post-Deployment Checklist

- [ ] Test PWA installation on mobile devices
- [ ] Verify service worker registration
- [ ] Check offline functionality
- [ ] Test responsive design
- [ ] Validate manifest file
- [ ] Test "Add to Home Screen" functionality

### Performance Optimization

The app includes:
- Next.js 15 with Turbopack for fast builds
- Tailwind CSS for optimized styles
- Lazy loading of components
- Optimized images and icons

### Monitoring

Set up monitoring in Vercel:
- Performance monitoring
- Error tracking
- Analytics (optional)

### Future Enhancements

1. **Database Integration**
   - Set up Supabase project
   - Configure tables and RLS
   - Add authentication

2. **Health Integrations**
   - HealthKit (iOS)
   - Health Connect (Android)
   - Manual data entry

3. **Productivity Integrations**
   - GitHub API
   - Todoist API
   - Notion API

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check
```

## Troubleshooting

### PWA Issues
- Clear browser cache
- Uninstall and reinstall PWA
- Check service worker registration in DevTools

### Build Issues
- Run `npm run type-check` to identify TypeScript errors
- Check for missing dependencies
- Verify Next.js configuration

### Performance Issues
- Use Vercel Analytics
- Check Core Web Vitals
- Optimize images and assets
