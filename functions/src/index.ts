import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import * as cors from 'cors';

// Initialize CORS middleware
const corsHandler = cors({
  origin: true, // Allow any origin, or specify your domains like ['yourdomain.com']
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

setGlobalOptions({ 
  maxInstances: 10,
  cors: true // Enable CORS for all v2 functions
});

admin.initializeApp();
const auth = getAuth();
const db = getFirestore();

// Let's split the functions into separate files for better organization
import { onEmailVerificationChange } from './auth/emailVerification';
import { processSignUp } from './auth/signUp';
import { resendVerificationEmail } from './auth/verification';
import { deleteUserAccount } from './auth/deletion';

// Re-export the functions
export { 
  onEmailVerificationChange,
  processSignUp,
  resendVerificationEmail,
  deleteUserAccount
};