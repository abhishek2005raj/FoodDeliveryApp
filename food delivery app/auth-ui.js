// ==========================================
// AUTH UI - FoodExpress
// Manages Header State (Login/Logout, Hi User, Orders link)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true" && Boolean(token);
  const userName = localStorage.getItem("userName");

  const welcomeUser = document.getElementById("welcomeUser");
  const authButton = document.getElementById("authButton");
  const nav = document.querySelector("nav");

  // 1. If logged in, add "Orders" link to nav menu if not already present
  if (nav && isLoggedIn) {
    const existingOrdersLink = Array.from(nav.querySelectorAll("a")).find(
      (a) => a.getAttribute("href") === "orders.html" || a.textContent.trim() === "Orders"
    );
    if (!existingOrdersLink) {
      const ordersLink = document.createElement("a");
      ordersLink.href = "orders.html";
      ordersLink.textContent = "Orders";
      nav.appendChild(ordersLink);
    }
  }

  // 2. Display "Hi, {Name}"
  if (welcomeUser) {
    if (isLoggedIn && userName) {
      welcomeUser.textContent = `Hi, ${userName.split(" ")[0]}`;
      welcomeUser.style.display = "inline-block";
    } else {
      welcomeUser.textContent = "";
      welcomeUser.style.display = "none";
    }
  }

  // 3. Update Auth Button (Login vs Logout)
  // Check for id="authButton" or any login button in .icons
  const authContainer = authButton || document.querySelector(".icons a[href='login.html']");

  if (authContainer) {
    const btn = authContainer.querySelector("button");

    if (isLoggedIn) {
      if (btn) btn.textContent = "Logout";

      authContainer.onclick = (event) => {
        event.preventDefault();

        // Clear auth credentials
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");

        alert("Logged out successfully!");
        window.location.href = "index.html";
      };
    } else {
      if (btn) btn.textContent = "Login";
      authContainer.onclick = null;
      if (authContainer.tagName === "A") {
        authContainer.href = "login.html";
      }
    }
  }
});
