"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserAccount = exports.resendVerificationEmail = exports.processSignUp = exports.onEmailVerificationChange = void 0;
const admin = require("firebase-admin");
const v2_1 = require("firebase-functions/v2");
(0, v2_1.setGlobalOptions)({
    maxInstances: 10,
});
admin.initializeApp();
// Import functions
const emailVerification_1 = require("./auth/emailVerification");
Object.defineProperty(exports, "onEmailVerificationChange", { enumerable: true, get: function () { return emailVerification_1.onEmailVerificationChange; } });
const signUp_1 = require("./auth/signUp");
Object.defineProperty(exports, "processSignUp", { enumerable: true, get: function () { return signUp_1.processSignUp; } });
const verification_1 = require("./auth/verification");
Object.defineProperty(exports, "resendVerificationEmail", { enumerable: true, get: function () { return verification_1.resendVerificationEmail; } });
const deletion_1 = require("./auth/deletion");
Object.defineProperty(exports, "deleteUserAccount", { enumerable: true, get: function () { return deletion_1.deleteUserAccount; } });
//# sourceMappingURL=index.js.map