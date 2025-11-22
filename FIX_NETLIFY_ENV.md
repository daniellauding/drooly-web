# 🚨 CRITICAL: Fix Environment Variables in Netlify UI

## Problem
All your branch deploys (new, dev, stage, main) are currently using the **SAME** environment variables because they're all scoped to "All". This means:
- ❌ dev.droo.ly is trying to use production Firebase
- ❌ stage.droo.ly is trying to use production Firebase  
- ❌ new branch is trying to use production Firebase

## Solution: Re-scope Environment Variables

### Step 1: Delete All Current Variables with "All" Scope

1. Go to: https://app.netlify.com/sites/drooly-web/configuration/env
2. For EACH variable below, click the 3 dots → **Delete**:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_MEASUREMENT_ID`
   - `VITE_APP_ENV`
   - `VITE_API_URL`
   - `NODE_ENV`

⚠️ **KEEP THESE** (they're the same across all environments):
   - `VITE_OPENAI_API_KEY`
   - `VITE_UNSPLASH_API_KEY`
   - `VITE_UNSPLASH_ACCESS_KEY`
   - `VITE_GA_TRACKING_ID`
   - `VITE_CUSTOM_DOMAIN`

### Step 2: Add Production Variables

Click **Add a variable** and for each one:
- **Scopes**: Select **"Production"** ONLY
- Add these variables:

```
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

### Step 3: Add Staging Variables

For the **stage** branch, you need a separate Netlify site. Check if you have these sites:
- **stage-drooly** (ID: 41bf2782-d482-4620-af2f-bdda6191b00f)
- **dev-drooly** (ID: 86f7eff9-e6b9-43c3-a66b-c753323dad00)

If yes, configure each separately:

#### For stage-drooly site:
https://app.netlify.com/sites/stage-drooly/configuration/env

```
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

#### For dev-drooly site:
https://app.netlify.com/sites/dev-drooly/configuration/env

```
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

### Step 4: Configure Branch Deploys (Alternative)

If you DON'T have separate sites for stage/dev, you need to:

1. Go to main site: https://app.netlify.com/sites/drooly-web/configuration/env
2. For Firebase variables, you'll need to manually specify scopes for each branch:
   - Click variable → Options → Edit scopes
   - Select **"Branch deploys"** → Type branch names: `stage`, `dev`, `new`
   
But this is complicated. **RECOMMENDED: Use separate Netlify sites for each environment.**

## After Making Changes

1. Go to **Deploys** for each site
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for build to complete
4. Test each environment:
   - https://droo.ly (production - should show recipes)
   - https://stage.droo.ly (staging - should connect to drooly-stage)
   - https://dev.droo.ly (dev - should connect to drooly-dev)

## Quick Check

After deploy, open browser console on each site and look for:
```
Firebase initialized successfully with project: [PROJECT_ID]
Current Environment Mode: [MODE]
```

Should see:
- droo.ly → project: `drooly`, mode: `production`
- stage.droo.ly → project: `drooly-stage`, mode: `staging`
- dev.droo.ly → project: `drooly-dev`, mode: `development`

