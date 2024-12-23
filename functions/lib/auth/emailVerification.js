"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEmailVerificationChange = void 0;
const functions = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const db = (0, firestore_1.getFirestore)();
exports.onEmailVerificationChange = functions.auth
    .user()
    .beforeSignIn(async (user) => {
    if (user.emailVerified) {
        console.log('Email verified for user:', user.uid);
        try {
            await db.collection('users').doc(user.uid).update({
                emailVerified: true,
                manuallyVerified: true,
                verifiedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('User document updated with verification status');
        }
        catch (error) {
            console.error('Error updating user verification status:', error);
        }
    }
});
//# sourceMappingURL=emailVerification.js.map