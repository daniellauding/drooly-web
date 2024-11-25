import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';

admin.initializeApp();

// Initialize CORS middleware
const corsHandler = cors({ origin: true });

export const deleteUserAuth = functions.https.onCall(async (data, context) => {
  // Check if the caller is authenticated and authorized
  if (!context.auth || !context.auth.token.email_verified) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated and verified to delete users.'
    );
  }

  try {
    console.log(`Attempting to delete user ${data.uid}`);
    
    // Get the caller's role from Firestore
    const callerDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    const callerData = callerDoc.data();

    if (!callerData || callerData.role !== 'superadmin') {
      console.log('Permission denied: caller is not a superadmin');
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only superadmins can delete users.'
      );
    }

    // Delete the user from Authentication
    await admin.auth().deleteUser(data.uid);
    
    // Also delete the user's document from Firestore
    await admin.firestore().collection('users').doc(data.uid).delete();
    
    console.log(`User ${data.uid} successfully deleted from Authentication and Firestore`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error deleting user from Authentication'
    );
  }
});