"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = void 0;
const functions = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const cors = require("cors");
const db = (0, firestore_1.getFirestore)();
const auth = (0, auth_1.getAuth)();
const corsHandler = cors({ origin: true });
exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "Must be authenticated to delete account");
    }
    const uid = context.auth.uid;
    console.log('Starting cleanup process for user:', uid);
    try {
        const batch = db.batch();
        // Delete user document
        const userRef = db.collection('users').doc(uid);
        batch.delete(userRef);
        // Delete user's recipes
        const recipesSnapshot = await db.collection('recipes')
            .where('createdBy', '==', uid)
            .get();
        recipesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Delete user's comments
        const commentsSnapshot = await db.collection('comments')
            .where('userId', '==', uid)
            .get();
        commentsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Delete user's notifications
        const notificationsSnapshot = await db.collection('notifications')
            .where('userId', '==', uid)
            .get();
        notificationsSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Delete user's likes/favorites
        const likesSnapshot = await db.collection('likes')
            .where('userId', '==', uid)
            .get();
        likesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        // Execute batch delete first
        await batch.commit();
        console.log('Successfully deleted all user data from Firestore');
        // Then delete from Auth
        await auth.deleteUser(uid);
        console.log('Successfully deleted user from Firebase Auth');
        return { success: true };
    }
    catch (error) {
        console.error('Error cleaning up user data:', error);
        throw new functions.https.HttpsError("internal", "Failed to clean up user data");
    }
});
//# sourceMappingURL=deletion.js.map