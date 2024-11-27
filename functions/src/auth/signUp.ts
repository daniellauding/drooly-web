import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const db = getFirestore();
const auth = getAuth();

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

    // Generate verification link
    const verificationLink = await auth.generateEmailVerificationLink(user.email, {
      url: 'https://drooly.firebaseapp.com/login'
    });

    // Queue welcome email
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
  } catch (error) {
    console.error("Error in processSignUp:", error);
    throw error;
  }
});