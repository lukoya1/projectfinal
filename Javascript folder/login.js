// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
// import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBaDfjFFpAUyAktDiGXisZ3L18kNAOVwEc",
//   authDomain: "onlinetutorial-5f74f.firebaseapp.com",
//   projectId: "onlinetutorial-5f74f",
//   storageBucket: "onlinetutorial-5f74f.firebasestorage.app",
//   messagingSenderId: "1007301854847",
//   appId: "1:1007301854847:web:e498cbdde90614acfc614a",
//   measurementId: "G-NR9ZXX3K6S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// window.auth = auth;

// window.loginUser = async function() {
//       const email = document.getElementById("loginEmail").value;
//       const password = document.getElementById("loginPassword").value;

//       try {
//         await signInWithEmailAndPassword(auth, email, password);
//         alert("Welcome User!");
//         window.location.href = "user-dashboard.html"; // change this to your user page
//       } catch (err) {
//         alert("Login failed: " + err.message);
//       }
//     };

//     // Admin login
//     window.loginAdmin = async function() {
//       const email = document.getElementById("loginEmail").value;
//       const password = document.getElementById("loginPassword").value;

//       try {
//         await signInWithEmailAndPassword(auth, email, password);

//         // Check if it's the admin account
//         if (email === "oluwatimi17@yahoo.com") {
//           alert("Welcome Admin!");
//           window.location.href = "content.html"; // admin comment/reply page
//         } else {
//           alert("This account is not an admin.");
//         }
//       } catch (err) {
//         alert("Admin login failed: " + err.message);
//       }
//     };




     import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBaDfjFFpAUyAktDiGXisZ3L18kNAOVwEc",
      authDomain: "onlinetutorial-5f74f.firebaseapp.com",
      projectId: "onlinetutorial-5f74f",
      storageBucket: "onlinetutorial-5f74f.firebasestorage.app",
      messagingSenderId: "1007301854847",
      appId: "1:1007301854847:web:e498cbdde90614acfc614a",
      measurementId: "G-NR9ZXX3K6S"
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    window.login = async function() {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        // ✅ both user and admin go to the same page
        window.location.href = "content.html";
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    };