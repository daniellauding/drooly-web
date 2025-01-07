export const verifyEnv = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    return false;
  }

  // Verify API key format (should be a long string)
  if (import.meta.env.VITE_FIREBASE_API_KEY.length < 30) {
    console.error('API key seems invalid (too short)');
    return false;
  }

  // Verify auth domain format
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN.includes('firebaseapp.com')) {
    console.error('Auth domain should end with firebaseapp.com');
    return false;
  }

  return true;
};