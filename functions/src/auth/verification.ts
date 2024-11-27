import * as functions from "firebase-functions";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

const db = getFirestore();
const auth = getAuth();

export const resendVerificationEmail = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Must be authenticated to perform this action"
    );
  }

  try {
    const user = await auth.getUser(context.auth.uid);
    
    if (!user.email) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User has no email address"
      );
    }

    const verificationLink = await auth.generateEmailVerificationLink(user.email, {
      url: 'https://drooly.firebaseapp.com/login'
    });
    
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
    
    return { success: true };
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Error resending verification email"
    );
  }
});