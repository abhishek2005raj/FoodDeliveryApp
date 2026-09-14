// ==========================================
// ADDRESS PAGE - FoodExpress
// Manages delivery address inputs and geolocation
// ==========================================

// Pre-fill fields if user details or existing address is in localStorage
document.addEventListener("DOMContentLoaded", () => {
  const savedAddress = JSON.parse(localStorage.getItem("address"));
  const userName = localStorage.getItem("userName");

  if (savedAddress) {
    if (savedAddress.name) document.getElementById("name").value = savedAddress.name;
    if (savedAddress.mobile) document.getElementById("mobile").value = savedAddress.mobile;
    if (savedAddress.house) document.getElementById("house").value = savedAddress.house;
    if (savedAddress.street) document.getElementById("street").value = savedAddress.street;
    if (savedAddress.city) document.getElementById("city").value = savedAddress.city;
    if (savedAddress.state) document.getElementById("state").value = savedAddress.state;
    if (savedAddress.pincode) document.getElementById("pincode").value = savedAddress.pincode;
  } else if (userName) {
    document.getElementById("name").value = userName;
  }
});

// ==========================================
// Geolocation: Auto-fetch current location
// ==========================================
const currentLocationBtn = document.getElementById("currentLocation");

if (currentLocationBtn) {
  currentLocationBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    currentLocationBtn.textContent = "📍 Detecting Location...";
    currentLocationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      getAddress,
      (err) => {
        alert("Location permission denied or unavailable.");
        currentLocationBtn.textContent = "📍 Use Current Location";
        currentLocationBtn.disabled = false;
      },
      { timeout: 10000 }
    );
  });
}

function getAddress(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
  )
    .then((response) => response.json())
    .then((data) => {
      const address = data.address || {};

      document.getElementById("city").value =
        address.city || address.town || address.village || address.suburb || "";

      document.getElementById("state").value = address.state || "";

      document.getElementById("pincode").value = address.postcode || "";

      if (address.road) {
        document.getElementById("street").value = address.road;
      }

      alert("Location detected successfully! Please verify and fill building/mobile.");
    })
    .catch(() => {
      alert("Unable to fetch address details from GPS coordinates.");
    })
    .finally(() => {
      currentLocationBtn.textContent = "📍 Use Current Location";
      currentLocationBtn.disabled = false;
    });
}

// ==========================================
// Save Address & Continue
// ==========================================
const saveAddressBtn = document.getElementById("saveAddress");

if (saveAddressBtn) {
  saveAddressBtn.addEventListener("click", function () {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const house = document.getElementById("house").value.trim();
    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    // Validation
    if (
      name === "" ||
      mobile === "" ||
      house === "" ||
      street === "" ||
      city === "" ||
      state === "" ||
      pincode === ""
    ) {
      alert("Please fill all delivery address fields.");
      return;
    }

    if (mobile.length !== 10 || isNaN(mobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (pincode.length !== 6 || isNaN(pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    const address = {
      name,
      mobile,
      house,
      street,
      city,
      state,
      pincode,
    };

    localStorage.setItem("address", JSON.stringify(address));

    window.location.href = "checkout.html";
  });
}