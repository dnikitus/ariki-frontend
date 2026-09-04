"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.auth = void 0;

var _app = require("firebase/app");

var _auth = require("firebase/auth");

// Replace with your Firebase Web App Configuration keys
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
var app = (0, _app.initializeApp)(firebaseConfig);
var auth = (0, _auth.getAuth)(app);
exports.auth = auth;
//# sourceMappingURL=firebase.dev.js.map
