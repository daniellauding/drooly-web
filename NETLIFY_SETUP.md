# Netlify Multi-Environment Setup Guide

## 🌍 Environment Overview

This project uses **three separate Firebase projects** for different environments:

| Branch | Environment | Firebase Project | Domain | Netlify Context |
|--------|-------------|------------------|---------|-----------------|
| `new` | Development | drooly-dev | dev.droo.ly | `context.new` |
| `stage` | Staging | drooly-stage | stage.droo.ly | `context.stage` |
| `main` | Production | drooly | droo.ly | `context.main` |

## 📋 Required Setup in Netlify

### Step 1: Set Environment Variables by Deploy Context

You need to configure **different environment variables** for each deploy context. Here's how:

#### 🔵 For Development (Branch: `new`)

1. Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**
2. Click **Add a variable**
3. Set **Scopes** to: **Specific deploy contexts** → Select **"Branch deploys"** → Type `new`
4. Add these variables:

```bash
NODE_ENV=production
VITE_APP_ENV=development
VITE_FIREBASE_PROJECT_ID=drooly-dev
VITE_FIREBASE_API_KEY=AIzaSyAwWnJzMj-Ue-9FOHxDeZDJSiNbaV8OrOA
VITE_FIREBASE_AUTH_DOMAIN=drooly-dev.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=drooly-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=998655731139
VITE_FIREBASE_APP_ID=1:998655731139:web:b5fd6d90fd43cfabe48976
VITE_FIREBASE_MEASUREMENT_ID=G-MCL6ECZQF2
VITE_API_URL=https://dev.droo.ly
```

**Optional APIs** (add your keys):
```bash
VITE_OPENAI_API_KEY=sk-...
VITE_UNSPLASH_API_KEY=...
VITE_UNSPLASH_ACCESS_KEY=...
VITE_GA_TRACKING_ID=G-...
VITE_CUSTOM_DOMAIN=dev.droo.ly
```

#### 🟢 For Staging (Branch: `stage`)

1. Same process, but select **"Branch deploys"** → Type `stage`
2. Add these variables:

```bash
NODE_ENV=production
VITE_APP_ENV=staging
VITE_FIREBASE_PROJECT_ID=drooly-stage
VITE_FIREBASE_API_KEY=AIzaSyDSQuIzboknuR99zhHTqWabnYgJPIqpGho
VITE_FIREBASE_AUTH_DOMAIN=drooly-stage.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=drooly-stage.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=276086519407
VITE_FIREBASE_APP_ID=1:276086519407:web:869bafad1ab6b44856bf9a
VITE_FIREBASE_MEASUREMENT_ID=G-CY5DWGB0J0
VITE_API_URL=https://stage.droo.ly
```

**Optional APIs** (add your keys):
```bash
VITE_OPENAI_API_KEY=sk-...
VITE_UNSPLASH_API_KEY=...
VITE_UNSPLASH_ACCESS_KEY=...
VITE_GA_TRACKING_ID=G-...
VITE_CUSTOM_DOMAIN=stage.droo.ly
```

#### 🔴 For Production (Branch: `main`)

1. Same process, but select **"Production"** context
2. Add these variables:

```bash
NODE_ENV=production
VITE_APP_ENV=production
VITE_FIREBASE_PROJECT_ID=drooly
VITE_FIREBASE_API_KEY=AIzaSyCwP0w894sxwbxwPwCMR7_i6i8Cowdt2dA
VITE_FIREBASE_AUTH_DOMAIN=drooly.firebaseapp.com
VITE_FIREBASE_STORAGE_BUCKET=drooly.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=727727122836
VITE_FIREBASE_APP_ID=1:727727122836:web:582334a12d884d0ab2c781
VITE_FIREBASE_MEASUREMENT_ID=G-YKZBQKZ7TK
VITE_API_URL=https://droo.ly
```

**Optional APIs** (add your production keys):
```bash
VITE_OPENAI_API_KEY=sk-...
VITE_UNSPLASH_API_KEY=...
VITE_UNSPLASH_ACCESS_KEY=...
VITE_GA_TRACKING_ID=G-...
VITE_CUSTOM_DOMAIN=droo.ly
```

### Step 2: Configure Custom Domains in Netlify

For each site/branch deploy in Netlify:

#### Development Site
1. Go to **Domain Settings**
2. Add custom domain: `dev.droo.ly`
3. Update DNS with Netlify's provided records
4. Wait for SSL to provision

#### Staging Site
1. Go to **Domain Settings**
2. Add custom domain: `stage.droo.ly`
3. Update DNS with Netlify's provided records
4. Wait for SSL to provision

#### Production Site
1. Go to **Domain Settings**
2. Add custom domain: `droo.ly`
3. Add `www.droo.ly` as alias
4. Update DNS with Netlify's provided records
5. Wait for SSL to provision

### Step 3: Enable Branch Deploys

1. Go to **Site Settings** → **Build & Deploy** → **Continuous Deployment**
2. Under **Branch deploys**, click **Configure**
3. Select **"Let me add individual branches"**
4. Add branches:
   - `new` (Development)
   - `stage` (Staging)
   - `main` (Production - should already be there)

## 🔒 Security Best Practices

### Firebase API Keys
- Firebase client API keys are **safe to expose** in client-side code
- They're designed to be public and protected by Firebase Security Rules
- However, still mark them as "Contains secret values" in Netlify for added security

### OpenAI API Keys
- ⚠️ **NEVER expose OpenAI keys in client-side code**
- Consider moving OpenAI calls to a backend/serverless function
- If you must use client-side, implement rate limiting and usage monitoring

### Environment Variables
- Mark all API keys as **"Contains secret values"** in Netlify
- This prevents them from appearing in build logs and UI

## 🚀 Deployment Workflow

### Development Flow
```bash
# Work on 'new' branch
git checkout new
# Make changes
git add .
git commit -m "feat: new feature"
git push origin new
# → Triggers deploy to dev.droo.ly
```

### Staging Flow
```bash
# Merge to stage for QA
git checkout stage
git merge new
git push origin stage
# → Triggers deploy to stage.droo.ly
```

### Production Flow
```bash
# When ready for production
git checkout main
git merge stage
git push origin main
# → Triggers deploy to droo.ly
```

## 🧪 Testing Different Environments Locally

```bash
# Test development build
npm run build:dev
npm run preview

# Test staging build
npm run build:stage
npm run preview

# Test production build
npm run build:prod
npm run preview
```

## 🔧 Netlify CLI Setup (Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your repository to Netlify site
netlify link

# Test deploy locally
netlify build

# Deploy to development
netlify deploy --alias=dev

# Deploy to production
netlify deploy --prod
```

## 📊 How Environment Detection Works

The app automatically detects which environment it's running in:

1. **Build time**: Vite reads the `--mode` flag and loads corresponding `.env` files
2. **Runtime**: The app checks `VITE_APP_ENV` and `VITE_FIREBASE_PROJECT_ID`
3. **Validation**: `systemStatus.ts` verifies that the Firebase project matches the environment

```typescript
// From src/utils/systemStatus.ts
const expectedProject = {
  development: 'drooly-dev',
  staging: 'drooly-stage', 
  production: 'drooly'
}[env];
```

## ⚙️ Build Commands

| Environment | Command | Output | Used By |
|-------------|---------|--------|---------|
| Development | `npm run build:dev` | Optimized dev build | `new` branch |
| Staging | `npm run build:stage` | Staging build | `stage` branch |
| Production | `npm run build:prod` | Production build | `main` branch |

## 🐛 Troubleshooting

### Build fails with "secrets detected"
- ✅ **Fixed**: Removed hardcoded secrets from `netlify.toml`
- Secrets now come from Netlify environment variables

### Wrong Firebase project connected
- Check `VITE_APP_ENV` matches `VITE_FIREBASE_PROJECT_ID`
- Verify environment variables are set for the correct deploy context

### Environment variables not working
- Ensure variables are set for the correct **deploy context** (not "All scopes")
- Trigger a new deploy after adding variables
- Check build logs to see which variables are available

### Domain not resolving
- Verify DNS records are correctly configured
- Wait up to 48 hours for DNS propagation
- Check SSL certificate status in Netlify

## 📝 Current Status

- ✅ `netlify.toml` configured for multi-environment deployment
- ✅ Secrets removed from version control
- ✅ Branch contexts defined (`new`, `stage`, `main`)
- ⏳ **TODO**: Set environment variables in Netlify Dashboard
- ⏳ **TODO**: Configure custom domains
- ⏳ **TODO**: Enable branch deploys

## 🔗 Quick Links

- [Netlify Dashboard](https://app.netlify.com)
- [Firebase Console](https://console.firebase.google.com)
- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide

