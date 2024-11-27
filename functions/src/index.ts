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
    if (!user.email) return;
    
    console.log("Processing signup for user:", user.email);

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

    // Send welcome email with detailed logging
    console.log("Attempting to send welcome email to:", user.email);
    try {
      await db.collection("mail").add({
        to: user.email,
        template: {
          name: "welcome",
          data: {
            userName: user.displayName || user.email,
            verificationLink: await auth.generateEmailVerificationLink(user.email)
          }
        }
      });
      console.log("Welcome email queued successfully for:", user.email);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      console.error("Email details:", {
        recipient: user.email,
        template: "welcome",
        userName: user.displayName || user.email
      });
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

    const verificationLink = await auth.generateEmailVerificationLink(user.email);
    
    // Send verification email using the mail collection
    await db.collection("mail").add({
      to: user.email,
      template: {
        name: "email-verification",
        data: {
          verificationLink,
          userName: user.displayName || user.email
        }
      }
    });
    
    console.log("Verification email sent successfully to:", user.email);
    return { success: true };
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error resending verification email"
    );
  }
});
