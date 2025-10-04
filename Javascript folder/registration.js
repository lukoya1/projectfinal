import { 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

window.register = async function() {
  const fullName = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  try {
    // Create new user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user display name
    await updateProfile(user, { displayName: fullName });

    alert("✅ Registration successful! You can now log in.");
    window.location.href = "login.html"; // redirect after registration
  } catch (error) {
    alert("❌ " + error.message);
    console.error(error);
  }
};