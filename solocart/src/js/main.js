// Dynamic Cart Update
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Listen for AJAX cart updates (if applicable)
  document.addEventListener("cart:updated", updateCartCount);
});

function updateCartCount() {
  fetch("/cart.js")
    .then((response) => response.json())
    .then((cart) => {
      const cartCount = cart.item_count;
      const cartCountElement = document.querySelector(".cart-icon .cart-count");

      // Check if the cart count element exists
      if (cartCountElement) {
        cartCountElement.textContent = cartCount;
      } else {
        // Create the cart count element if it doesn't exist
        const cartIcon = document.querySelector(".cart-icon");
        const span = document.createElement("span");
        span.classList.add("cart-count");
        span.textContent = cartCount;
        cartIcon.appendChild(span);
      }
    })
    .catch((error) => console.error("Error fetching cart data:", error));
}

// Hamburger Menu
document.addEventListener("DOMContentLoaded", function () {
  // Select elements
  const hamburgerButton = document.querySelector(".hamburger-menu");
  const closeButton = document.querySelector(".close-menu");
  const navMenu = document.getElementById("main-nav-menu");

  // Function to toggle the navigation menu
  function toggleMenu() {
    navMenu.classList.toggle("active");
  }

  // Function to close the menu
  function closeMenu() {
    navMenu.classList.remove("active");
  }

  // Open the menu when clicking the hamburger button
  hamburgerButton.addEventListener("click", toggleMenu);

  // Close the menu when clicking the close button
  closeButton.addEventListener("click", closeMenu);

  // Close the menu when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      !navMenu.contains(event.target) &&
      !event.target.closest(".hamburger-menu")
    ) {
      closeMenu();
    }
  });
});
