// Dynamic Cart Update
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount(); // Initial cart count update
  document.addEventListener("cart:updated", updateCartCount); // Listen for custom cart updated event
});

function updateCartCount() {
  fetch("/cart.js")
    .then((response) => response.json())
    .then((cart) => {
      console.log("Cart data:", cart); // Log cart data for debugging
      const cartCount = cart.item_count;
      const cartCountElement = document.querySelector(".cart-icon .cart-count");

      if (cartCountElement) {
        cartCountElement.textContent = cartCount;
      } else {
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
  const hamburgerButton = document.querySelector(".hamburger-menu");
  const closeButton = document.querySelector(".close-menu");
  const navMenu = document.getElementById("main-nav-menu");

  function toggleMenu() {
    navMenu.classList.toggle("active");
  }

  function closeMenu() {
    navMenu.classList.remove("active");
  }

  hamburgerButton.addEventListener("click", toggleMenu);
  closeButton.addEventListener("click", closeMenu);

  document.addEventListener("click", function (event) {
    if (
      !navMenu.contains(event.target) &&
      !event.target.closest(".hamburger-menu")
    ) {
      closeMenu();
    }
  });
});

// Product Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners for 'Add to Cart' buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      console.log("Adding product to cart:", productId); // Log the product ID
      addToCart(productId);
    });
  });

  // Function to add product to cart
  function addToCart(productId, quantity = 1) {
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: productId, // Ensure this is a valid variant ID
        quantity: quantity, // Adjust the quantity as needed
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error adding product to cart: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Product added:", data); // Log the response data to check for errors
        alert("Product added to cart!");
        updateCartCount(); // Update the cart count after adding the product
        document.dispatchEvent(new Event("cart:updated")); // Optional: dispatch a custom event
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert(
          "There was an error adding the product to your cart. Please try again."
        );
      });
  }

  // Function to open product details popup
  // Define the currency symbol (You can fetch it dynamically if needed)
  const currencySymbol = "$"; // Update this as per your store's currency symbol

  function openProductPopup(productHandle) {
    fetch(`/products/${productHandle}.js`)
      .then((response) => response.json())
      .then((product) => {
        const popup = document.getElementById("product-popup");
        const popupContent = document.querySelector(".product-popup-details");

        // Populate the product details in the popup
        popupContent.innerHTML = `
        <div class="product-popup-left">
          <img src="${product.images[0]}" alt="${product.title}">
        </div>
        <div class="product-popup-right">
          <h2>${product.title}</h2>
          <p>${product.description}</p>
          <div class="popup-price">
            ${
              product.compare_at_price
                ? `<span class="sale-price">Sale Price: ${currencySymbol}${(
                    product.price / 100
                  ).toFixed(2)}</span>
              <span class="original-price">Original Price: ${currencySymbol}${(
                    product.compare_at_price / 100
                  ).toFixed(2)}</span>`
                : `<span class="regular-price">Regular Price: ${currencySymbol}${(
                    product.price / 100
                  ).toFixed(2)}</span>`
            }
          </div>
          <div class="product-quantity">
            <label for="product-quantity-input">Quantity</label>
            <input type="number" id="product-quantity-input" value="1" min="1">
          </div>
          <div class="product-popup-btns">
            <button type="button" class="btn-primary add-to-cart" data-product-id="${
              product.variants[0].id
            }">Add to Cart</button>
            <button type="button" class="btn-primary view-full-product" data-product-handle="${
              product.handle
            }">View Full Product</button>
          </div>
        </div>
      `;
        // Open the popup
        popup.style.display = "block";

        // Ensure only one event listener is added for the 'Add to Cart' button in the popup
        const popupAddToCartButton = document.querySelector(
          ".product-popup .add-to-cart"
        );
        popupAddToCartButton.removeEventListener("click", handleAddToCart);
        popupAddToCartButton.addEventListener("click", handleAddToCart);

        // Add event listener for viewing the full product details
        const viewFullProductButton = document.querySelector(
          ".product-popup .view-full-product"
        );
        viewFullProductButton.addEventListener("click", function () {
          window.location.href = `/products/${product.handle}`;
        });

        // Function to handle adding to cart with quantity
        function handleAddToCart() {
          const productId = this.getAttribute("data-product-id");
          const quantity = document.getElementById("product-quantity-input")
            .value;
          addToCart(productId, parseInt(quantity)); // Pass quantity to addToCart
        }
      })
      .catch((error) =>
        console.error("Error fetching product details:", error)
      );
  }

  // Close the product popup
  document.querySelector(".close-popup").addEventListener("click", function () {
    document.getElementById("product-popup").style.display = "none";
  });

  // Close popup when clicking outside the popup content
  window.addEventListener("click", function (event) {
    const popup = document.getElementById("product-popup");
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });

  // Attach event listeners to the 'View Product' buttons to open product popup
  document.querySelectorAll(".view-product").forEach((button) => {
    button.addEventListener("click", function () {
      const productHandle = this.getAttribute("data-product-handle");
      openProductPopup(productHandle);
    });
  });
});
