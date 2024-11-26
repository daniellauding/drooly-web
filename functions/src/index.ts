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

    // Send welcome email
    await db.collection("mail").add({
      to: user.email,
      template: {
        name: "welcome",
        data: {
          userName: user.displayName || user.email
        }
      }
    });
  } catch (error) {
    console.error("Error in processSignUp:", error);
  }
});

export const deleteUserAuth = onCall(async (request) => {
  const { uid } = request.data;

  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated to perform this action"
    );
  }

  try {
    await auth.deleteUser(uid);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error deleting user account"
    );
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
    const user = await auth.getUser(request.data.userId);
    if (!user) {
      throw new functions.https.HttpsError(
        "not-found",
        "User not found"
      );
    }

    const customToken = await auth.createCustomToken(user.uid);
    const link = await auth.generateEmailVerificationLink(user.email!);
    
    // Send email using your email service
    await db.collection("mail").add({
      to: user.email,
      template: {
        name: "email-verification",
        data: {
          verificationLink: link,
          userName: user.displayName || user.email
        }
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error resending verification email"
    );
  }
});

export const processDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Delete user document
    await db.collection("users").doc(user.uid).delete();
    
    // Delete user's recipes
    const recipesSnapshot = await db.collection("recipes")
      .where("creatorId", "==", user.uid)
      .get();
    
    const batch = db.batch();
    recipesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error in processDelete:", error);
  }
});
