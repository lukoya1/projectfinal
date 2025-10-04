

import { 
  getFirestore, collection, addDoc, serverTimestamp, 
  query, orderBy, onSnapshot 
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged, signOut } 
  from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

let currentVideoId = null;
let currentUser = null;
let isAdmin = false;

// ---------------- AUTH STATE ---------------- //
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    isAdmin = (user.email === "oluwatimi17@yahoo.com"); // ✅ your admin email
    console.log("Logged in as:", user.email, "Admin?", isAdmin);
  } else {
    currentUser = null;
    isAdmin = false;
    console.warn("No user logged in.");
    // Optional: redirect back to login page
    // window.location.href = "login.html";
  }
});

// ---------------- VIDEO MODAL ---------------- //
window.openModal = function(videoId) {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("ytVideo");

  currentVideoId = videoId; 
  video.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.style.display = "block";

  loadComments(videoId);
};

window.closeModal = function() {
  const modal = document.getElementById("videoModal");
  const video = document.getElementById("ytVideo");

  modal.style.display = "none";
  video.src = "";
  document.getElementById("commentList").innerHTML = ""; 
  currentVideoId = null;
};

window.onclick = function(event) {
  const modal = document.getElementById("videoModal");
  if (event.target === modal) closeModal();
};

// ---------------- COMMENTS ---------------- //
window.postComment = async function () {
  const commentInput = document.getElementById("commentInput");
  const text = commentInput.value.trim();

  if (!text || !currentVideoId) {
    alert("Please enter a comment!");
    return;
  }

  try {
    const docRef = await addDoc(collection(db, `videos/${currentVideoId}/comments`), {
      text,
      createdAt: serverTimestamp(),
      user: currentUser ? (isAdmin ? "Admin" : "User") : "User"
    });
    console.log("✅ Comment added with ID:", docRef.id);
    commentInput.value = "";
  } catch (err) {
    console.error("❌ Error posting comment:", err);
    alert("Error posting comment: " + err.message);
  }
};

function loadComments(videoId) {
  const q = query(collection(db, `videos/${videoId}/comments`), orderBy("createdAt", "desc"));
  const commentList = document.getElementById("commentList");

  onSnapshot(q, (snapshot) => {
    console.log("📡 Snapshot received:", snapshot.size, "docs");

    commentList.innerHTML = "";
    if (snapshot.empty) {
      const noComments = document.createElement("p");
      noComments.textContent = "No comments yet. Be the first!";
      commentList.appendChild(noComments);
      return;
    }

    snapshot.forEach((doc) => {
      const commentData = doc.data();
      console.log("📝 Comment data:", doc.id, commentData);

      const commentBox = document.createElement("div");
      commentBox.classList.add("comment-box");

      const userName = document.createElement("strong");
      userName.textContent = commentData.user || "User";

      const commentContent = document.createElement("p");
      commentContent.textContent = commentData.text || "(no text)";

      commentBox.appendChild(userName);
      commentBox.appendChild(commentContent);

      // ✅ Only Admin sees reply button
      if (isAdmin) {
        const replyBtn = document.createElement("span");
        replyBtn.classList.add("reply-btn");
        replyBtn.textContent = "Reply";
        replyBtn.onclick = () => showReplyArea(videoId, doc.id);
        commentBox.appendChild(replyBtn);
      }

      const replyList = document.createElement("div");
      replyList.classList.add("reply-list");
      replyList.id = `replies-${doc.id}`;
      commentBox.appendChild(replyList);

      commentList.appendChild(commentBox);

      // Load replies
      loadReplies(videoId, doc.id);
    });
  }, (err) => {
    console.error("❌ Error loading comments:", err);
  });
}

// ---------------- REPLIES ---------------- //
function showReplyArea(videoId, commentId) {
  const replyList = document.getElementById(`replies-${commentId}`);
  if (replyList.querySelector(".reply-area")) return;

  const replyArea = document.createElement("div");
  replyArea.classList.add("reply-area");

  const replyInput = document.createElement("textarea");
  replyInput.placeholder = "Admin reply...";

  const replyButton = document.createElement("button");
  replyButton.textContent = "Reply";
  replyButton.onclick = () => {
    postReply(videoId, commentId, replyInput.value);
    replyArea.remove();
  };

  replyArea.appendChild(replyInput);
  replyArea.appendChild(replyButton);
  replyList.appendChild(replyArea);
}

async function postReply(videoId, commentId, replyText) {
  const text = replyText.trim();
  if (!text) {
    alert("Please enter a reply!");
    return;
  }

  try {
    await addDoc(collection(db, `videos/${videoId}/comments/${commentId}/replies`), {
      text,
      createdAt: serverTimestamp(),
      user: "Admin"
    });
  } catch (err) {
    console.error("❌ Error posting reply:", err);
  }
}

function loadReplies(videoId, commentId) {
  const q = query(collection(db, `videos/${videoId}/comments/${commentId}/replies`), orderBy("createdAt", "asc"));
  const repliesDiv = document.getElementById(`replies-${commentId}`);

  onSnapshot(q, (snapshot) => {
    repliesDiv.innerHTML = "";
    snapshot.forEach((doc) => {
      const reply = doc.data();

      const replyDiv = document.createElement("div");
      replyDiv.classList.add("reply");

      const userName = document.createElement("strong");
      userName.textContent = reply.user || "Admin";

      const replyContent = document.createElement("p");
      replyContent.textContent = reply.text;

      replyDiv.appendChild(userName);
      replyDiv.appendChild(replyContent);
      repliesDiv.appendChild(replyDiv);
    });
  }, (err) => {
    console.error("❌ Error loading replies:", err);
  });
}

// ---------------- LOGOUT ---------------- //
window.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        await signOut(auth);
        console.log("✅ Logged out");
        window.location.href = "login.html"; // redirect to login page
      } catch (err) {
        console.error("❌ Error logging out:", err);
      }
    });
  }
});




window.logout = async function() {
  try {
    await signOut(auth);
    alert("You have been logged out.");
    window.location.href = "login.html";
  } catch (err) {
    console.error("Logout error:", err);
    alert("Logout failed: " + (err.message || err));
  }
};