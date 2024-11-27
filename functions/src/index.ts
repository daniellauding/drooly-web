import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const auth = getAuth();
const db = getFirestore();

// Listen for user email verification changes
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

export const processSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    if (!user.email) {
      console.error("No email provided for user:", user.uid);
      return;
    }
    
    console.log("Processing signup for user:", user.email);

    // Create user document
    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      console.log("Creating new user document for:", user.email);
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName || "",
        role: "user",
        emailVerified: user.emailVerified,
        manuallyVerified: false,
        awaitingVerification: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // Generate verification link with authorized domain
    console.log("Generating verification link for:", user.email);
    const verificationLink = await auth.generateEmailVerificationLink(user.email, {
      url: 'https://drooly.firebaseapp.com/login'
    });
    console.log("Verification link generated successfully");

    // Send welcome email with verification link
    try {
      console.log("Queueing welcome email for:", user.email);
      await db.collection("mail").add({
        to: user.email,
        template: {
          name: "welcome",
          data: {
            userName: user.displayName || user.email,
            verificationLink: verificationLink
          }
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'pending'
      });
      console.log("Welcome email queued successfully for:", user.email);
    } catch (emailError) {
      console.error("Error queueing welcome email:", emailError);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to queue welcome email"
      );
    }
  } catch (error) {
    console.error("Error in processSignUp:", error);
    throw error;
  }
});

export const resendVerificationEmail = onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated to perform this action"
    );
  }

  try {
    console.log("Resending verification email for user:", request.auth.uid);
    const user = await auth.getUser(request.auth.uid);
    
    if (!user.email) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User has no email address"
      );
    }

    const verificationLink = await auth.generateEmailVerificationLink(user.email, {
      url: 'https://drooly.firebaseapp.com/login'
    });
    
    // Queue verification email
    await db.collection("mail").add({
      to: user.email,
      template: {
        name: "email-verification",
        data: {
          verificationLink,
          userName: user.displayName || user.email
        }
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending'
    });
    
    console.log("Verification email queued successfully for:", user.email);
    return { success: true };
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error resending verification email"
    );
  }
});