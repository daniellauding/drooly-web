import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { defineString } from "firebase-functions/params";

setGlobalOptions({ maxInstances: 10 });

admin.initializeApp();
const auth = getAuth();
const db = getFirestore();

export const createUser = onCall(async (request) => {
  const { email, password, name } = request.data;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await db.collection("users").doc(userRecord.uid).set({
      email,
      name,
      role: "user",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { userId: userRecord.uid };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error creating user account"
    );
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

export const processSignUp = functions.auth.user().onCreate(async (user) => {
  try {
    if (!user.email) return;

    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        name: user.displayName || "",
        role: "user",
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