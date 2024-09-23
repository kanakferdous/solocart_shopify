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

// Function to add product to cart
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      addToCart(productId);
    });
  });

  function addToCart(productId) {
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: productId,
        quantity: 1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Product added to cart!");
      })
      .catch((error) => console.error("Error adding to cart:", error));
  }

  // Function to open product details popup
  document.querySelectorAll(".view-product").forEach((button) => {
    button.addEventListener("click", function () {
      const productHandle = this.getAttribute("data-product-handle");
      openProductPopup(productHandle);
    });
  });

  function openProductPopup(productHandle) {
    fetch(`/products/${productHandle}.js`)
      .then((response) => response.json())
      .then((product) => {
        const popup = document.getElementById("product-popup");
        const popupContent = document.querySelector(".product-popup-details");

        // Populate product details in the popup
        popupContent.innerHTML = `
          <h2>${product.title}</h2>
          <img src="${product.images[0]}" alt="${product.title}">
          <p>${product.description}</p>
          <div class="popup-price">
            ${
              product.compare_at_price
                ? `<span class="sale-price">${(product.price / 100).toFixed(
                    2
                  )}</span>
               <span class="original-price">${(
                 product.compare_at_price / 100
               ).toFixed(2)}</span>`
                : `<span class="regular-price">${(product.price / 100).toFixed(
                    2
                  )}</span>`
            }
          </div>
          <button type="button" class="btn add-to-cart" data-product-id="${
            product.variants[0].id
          }">Add to Cart</button>
        `;

        // Open the popup
        popup.style.display = "block";

        // Re-attach event listener for the new Add to Cart button in the popup
        document
          .querySelector(".product-popup .add-to-cart")
          .addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            addToCart(productId);
          });
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }

  // Close popup when clicking on close button or outside the popup content
  document.querySelector(".close-popup").addEventListener("click", function () {
    document.getElementById("product-popup").style.display = "none";
  });

  window.addEventListener("click", function (event) {
    const popup = document.getElementById("product-popup");
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
});
