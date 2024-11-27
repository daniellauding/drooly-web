import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import * as admin from "firebase-admin";

const db = getFirestore();

export const onEmailVerificationChange = functions.auth.user().onEmailVerified(async (user) => {
  console.log('Email verified for user:', user.uid);
  try {
    await db.collection('users').doc(user.uid).update({
      emailVerified: true,
      manuallyVerified: true,
      verifiedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('User document updated with verification status');
  } catch (error) {
    console.error('Error updating user verification status:', error);
  }
});