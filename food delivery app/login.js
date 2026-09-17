// ==========================================
// AUTHENTICATION - FoodExpress
// Connected to Express + MongoDB Atlas Backend
// ==========================================

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authMessage = document.getElementById("authMessage");

// Fallback API_BASE_URL if config.js is not loaded
const baseUrl = typeof window.API_BASE_URL !== "undefined"
  ? window.API_BASE_URL
  : "https://onrender.com";


// Helper to show inline status messages
function showMessage(message, success = false) {
  authMessage.textContent = message;
  authMessage.className = success
    ? "auth-message success"
    : "auth-message error";
}

// Toggle between Login and Signup forms
document.getElementById("showSignup").addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.style.display = "none";
  signupForm.style.display = "block";
  authMessage.textContent = "";
});

document.getElementById("showLogin").addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  loginForm.style.display = "block";
  authMessage.textContent = "";
});

// Helper to get query parameter (e.g. ?redirect=address.html)
function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("redirect") || "menu.html";
}

// ==========================================
// SIGN UP / REGISTER
// ==========================================
document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const signupBtn = document.getElementById("signupBtn");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !password || !confirmPassword) {
    showMessage("Please fill all fields.");
    return;
  }

  if (!emailPattern.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match.");
    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = "Creating Account...";

  try {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Store JWT token and user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userId", data.user._id);

      showMessage("🎉 Account created successfully! Redirecting...", true);

      setTimeout(() => {
        window.location.href = getRedirectUrl();
      }, 900);
    } else {
      showMessage(data.message || "Registration failed. Please try again.");
      signupBtn.disabled = false;
      signupBtn.textContent = "Sign Up";
    }
  } catch (err) {
    console.error("Registration error:", err);
    showMessage("Unable to connect to server. Is the backend running?");
    signupBtn.disabled = false;
    signupBtn.textContent = "Sign Up";
  }
});

// ==========================================
// LOGIN
// ==========================================
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const loginBtn = document.getElementById("loginBtn");

  if (!email || !password) {
    showMessage("Please fill all fields.");
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    showMessage("Please enter a valid email address.");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  try {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Store JWT token and user details in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.user.email);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userId", data.user._id);

      showMessage("✅ Login successful! Redirecting...", true);

      setTimeout(() => {
        window.location.href = getRedirectUrl();
      }, 700);
    } else {
      showMessage(data.message || "Invalid email or password.");
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
    }
  } catch (err) {
    console.error("Login error:", err);
    showMessage("Unable to connect to server. Is the backend running?");
    loginBtn.disabled = false;
    loginBtn.textContent = "Login";
  }
});
