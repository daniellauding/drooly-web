"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSignUp = void 0;
const functions = require("firebase-functions");
const firestore_1 = require("firebase-admin/firestore");
const auth_1 = require("firebase-admin/auth");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const db = (0, firestore_1.getFirestore)();
const auth = (0, auth_1.getAuth)();
// Create mail transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
    try {
        if (!user.email) {
            console.error("[SignUp] No email provided for user:", user.uid);
            return;
        }
        console.log("[SignUp] Processing signup for user:", user.email);
        // Generate verification link
        console.log("[SignUp] Generating verification link...");
        const verificationLink = await auth.generateEmailVerificationLink(user.email, {
            url: process.env.NODE_ENV === 'development'
                ? 'http://localhost:8080/login'
                : 'https://drooly.firebaseapp.com/login'
        });
        console.log("[SignUp] Verification link generated:", verificationLink);
        // Queue welcome email
        console.log("[SignUp] Queueing welcome email...");
        const mailDoc = await db.collection("mail").add({
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
        console.log("[SignUp] Welcome email queued with ID:", mailDoc.id);
        // For local development, send email directly
        if (process.env.NODE_ENV === 'development') {
            console.log("[SignUp] Sending verification email directly in development...");
            try {
                const info = await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: user.email,
                    subject: 'Verify your email address',
                    html: `
            <h1>Welcome to Drooly!</h1>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verificationLink}">Verify Email</a>
          `
                });
                console.log("[SignUp] Development email sent:", info.messageId);
            }
            catch (emailError) {
                console.error("[SignUp] Error sending development email:", emailError);
            }
        }
        console.log("[SignUp] Signup process completed successfully for:", user.email);
    }
    catch (error) {
        console.error("[SignUp] Error in processSignUp:", error);
        throw error;
    }
});
//# sourceMappingURL=signUp.js.map