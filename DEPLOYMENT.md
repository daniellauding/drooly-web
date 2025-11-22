# Deployment Guide

## Netlify Deployment Setup

### 1. Build Configuration

The app is pre-configured for Netlify deployment with the existing `netlify.toml` file.

### 2. Environment Variables Setup

In your Netlify dashboard, go to **Site Settings > Environment Variables** and add the following:

#### Required Firebase Variables
```
VITE_APP_ENV=production
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Optional API Keys (for full functionality)
```
VITE_OPENAI_API_KEY=sk-...your_openai_key
VITE_UNSPLASH_API_KEY=your_unsplash_key
VITE_GA_TRACKING_ID=G-...your_ga_id
```

### 3. Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to **Project Settings** > **General**
4. Scroll down to **Your apps** section
5. Click **Add app** > **Web** (or select existing web app)
6. Copy the configuration values from the `firebaseConfig` object

### 4. Firebase Security Rules

For development/testing, you can use permissive rules. In Firebase Console:

**Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

**Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // WARNING: Only for development!
    }
  }
}
```

### 5. Deployment Commands

#### Build and Deploy
```bash
# Build for production
npm run build:prod

# Preview build locally
npm run preview

# Deploy via Netlify CLI (optional)
netlify deploy --prod
```

#### Environment-specific builds
```bash
# Development build
npm run build:dev

# Staging build  
npm run build:stage

# Production build
npm run build:prod
```

### 6. Custom Domain Setup

1. In Netlify dashboard, go to **Domain Settings**
2. Add your custom domain
3. Update DNS settings as instructed
4. SSL certificate will be auto-generated

### 7. Troubleshooting

**Common Issues:**

1. **Firebase Permissions Error**
   - Check Firestore security rules
   - Verify API key has correct permissions
   - Ensure project ID matches

2. **Build Failures**
   - Check all required environment variables are set
   - Verify API keys are valid
   - Check for TypeScript errors

3. **Missing Features**
   - OpenAI key required for AI recipe generation
   - Unsplash key required for image search
   - GA key required for analytics

### 8. Performance Optimization

The app includes:
- Code splitting
- Image optimization
- Bundle analysis
- PWA capabilities (if configured)

### 9. Monitoring

Set up monitoring with:
- Firebase Analytics (included)
- Google Analytics (if GA key provided)
- Netlify Analytics (built-in)

## Alternative Deployment Options

### Vercel
1. Connect GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and deploy
firebase login
firebase use your-project-id
firebase deploy
```

### Manual Build
```bash
# Create production build
npm run build:prod

# Upload dist/ folder to any static hosting service
```