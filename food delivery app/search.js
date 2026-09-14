// ==========================================
// SEARCH PAGE - FoodExpress
// Dynamically filters rendered food cards
// ==========================================

const searchInput = document.getElementById("searchFood");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase().trim();
    const cards = document.querySelectorAll("#menu-container .card, .category-container .card");
    let foundCount = 0;

    cards.forEach((card) => {
      const heading = card.querySelector("h3");
      if (!heading) return;

      const foodName = heading.textContent.toLowerCase();

      if (foodName.includes(value)) {
        card.style.display = "";
        foundCount++;
      } else {
        card.style.display = "none";
      }
    });

    // No Food Found Message
    const noResult = document.getElementById("no-result");
    if (noResult) {
      if (foundCount > 0 || value === "") {
        noResult.style.display = "none";
      } else {
        noResult.style.display = "block";
      }
    }
  });
}