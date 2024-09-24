// Initialize all main functionalities after DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  initCart(); // Initialize Cart Functionality
  initProductFunctionality(); // Initialize Product Functionality
  initHamburgerMenu(); // Initialize Hamburger Menu
});

// CART FUNCTIONALITY
function initCart() {
  const cartIcon = document.querySelector(".cart-icon");
  const closeCartButton = document.querySelector(".close-cart");
  const cartSidebar = document.getElementById("cart-sidebar");
  const updateCartButton = document.querySelector(".btn-update-cart");

  cartIcon?.addEventListener("click", function (event) {
    event.preventDefault();
    toggleCartSidebar();
  });

  closeCartButton?.addEventListener("click", closeCartSidebar);

  // Close the cart sidebar when clicking outside of it
  document.addEventListener("click", function (event) {
    if (
      cartSidebar &&
      !cartSidebar.contains(event.target) &&
      !cartIcon.contains(event.target)
    ) {
      closeCartSidebar();
    }
  });

  // Initial cart count and sidebar update
  updateCartCount();
  updateCartSidebar();

  document.addEventListener("cart:updated", updateCartSidebar);

  // Always keep Update Cart button enabled and functional
  if (updateCartButton) {
    updateCartButton.disabled = false; // Enable the button
    updateCartButton.addEventListener("click", function () {
      updateCartFromSidebar(); // Update cart quantities based on sidebar inputs
    });
  }

  function toggleCartSidebar() {
    if (cartSidebar) {
      cartSidebar.classList.toggle("active");
      document.body.classList.toggle("cart-sidebar-active");
      updateCartSidebar();
    }
  }

  function closeCartSidebar() {
    if (cartSidebar) {
      cartSidebar.classList.remove("active");
      document.body.classList.remove("cart-sidebar-active");
    }
  }

  function updateCartCount() {
    fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        const cartCount = cart.item_count;
        const cartCountElement = document.querySelector(
          ".cart-icon .cart-count"
        );
        if (cartCountElement) {
          cartCountElement.textContent = cartCount;
        } else {
          const span = document.createElement("span");
          span.classList.add("cart-count");
          span.textContent = cartCount;
          cartIcon.appendChild(span);
        }
      })
      .catch((error) => console.error("Error fetching cart data:", error));
  }

  function updateCartSidebar() {
    fetch("/cart.js")
      .then((response) => response.json())
      .then((cart) => {
        const cartItemsContainer = document.querySelector(".cart-items");
        const cartTotalPrice = document.querySelector(".cart-total-price");
        const viewCartButton = document.querySelector(".btn-view-cart");
        const checkoutButton = document.querySelector(".btn-checkout");

        if (cartItemsContainer && cartTotalPrice) {
          cartItemsContainer.innerHTML = "";

          if (cart.item_count === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            cartTotalPrice.textContent = `$0.00`;
            // Hide View Cart and Checkout Buttons when cart is empty
            viewCartButton.style.display = "none";
            checkoutButton.style.display = "none";
            updateCartButton.style.display = "none"; // Hide update cart button
            return;
          }

          viewCartButton.style.display = "block"; // Show View Cart button
          checkoutButton.style.display = "block"; // Show Checkout button
          updateCartButton.style.display = "block"; // Show update cart button

          cart.items.forEach((item) => {
            const itemHTML = `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details-wrap">
                  <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-ppin">
                      <p class="cart-item-qp">${item.quantity} x $${(
              item.price / 100
            ).toFixed(2)}</p>
                      <input type="number" class="item-quantity" value="${
                        item.quantity
                      }" min="1" data-line="${item.key}">
                    </div>
                    <button type="button" class="btn-remove-item" data-line="${
                      item.key
                    }"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                  <div class="cart-item-total">
                    $${((item.price * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            `;
            cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
          });

          cartTotalPrice.textContent = `$${(cart.total_price / 100).toFixed(
            2
          )}`;

          // Attach event listeners for quantity input fields and remove buttons
          document.querySelectorAll(".item-quantity").forEach((input) => {
            input.addEventListener("input", function () {
              updateCartButton.disabled = false; // Enable update button on change
            });
          });

          document.querySelectorAll(".btn-remove-item").forEach((button) => {
            button.addEventListener("click", function () {
              const lineItemKey = this.getAttribute("data-line");
              removeFromCart(lineItemKey);
            });
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }

  // Update cart quantities based on sidebar inputs
  function updateCartFromSidebar() {
    const itemsToUpdate = [];
    document.querySelectorAll(".item-quantity").forEach((input) => {
      const lineItemKey = input.getAttribute("data-line");
      const quantity = parseInt(input.value, 10);

      // Collect items to be updated in the cart
      itemsToUpdate.push({
        id: lineItemKey,
        quantity: quantity,
      });
    });

    // Call the API to update all items at once
    updateCartItems(itemsToUpdate);
  }

  // Update multiple cart items with one request
  function updateCartItems(items) {
    fetch("/cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        updates: items.reduce((acc, item) => {
          acc[item.id] = item.quantity;
          return acc;
        }, {}),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error updating items in cart.");
        }
        return response.json();
      })
      .then(() => {
        showNotification("Cart updated successfully!");
        updateCartCount();
        updateCartSidebar();
        document.dispatchEvent(new Event("cart:updated"));
      })
      .catch((error) => {
        console.error("Error updating items in cart:", error);
        showNotification(
          `There was an error updating the items in your cart: ${error.message}`
        );
      });
  }

  function removeFromCart(lineItemKey) {
    fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: lineItemKey,
        quantity: 0,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error removing item from cart: " + response.statusText
          );
        }
        return response.json();
      })
      .then(() => {
        showNotification("Item removed from cart!");
        updateCartCount();
        updateCartSidebar();
        document.dispatchEvent(new Event("cart:updated"));
      })
      .catch((error) => {
        console.error("Error removing item from cart:", error);
        showNotification(
          "There was an error removing the item from your cart."
        );
      });
  }

  // Expose `updateCartCount` to the global scope for use in other functions
  window.updateCartCount = updateCartCount;
}

// PRODUCT FUNCTIONALITY
function initProductFunctionality() {
  // Manage product functionalities, including adding products to cart and viewing product details.
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      addToCart(productId);
    });
  });

  function addToCart(productId, quantity = 1) {
    fetch("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        id: productId,
        quantity: quantity,
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
      .then(() => {
        showNotification("Product added to cart!");
        updateCartCount(); // This function is globally accessible
        document.dispatchEvent(new Event("cart:updated"));
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        showNotification("There was an error adding the product to your cart.");
      });
  }

  function openProductPopup(productHandle) {
    fetch(`/products/${productHandle}.js`)
      .then((response) => response.json())
      .then((product) => {
        const popup = document.getElementById("product-popup");
        const popupContent = document.querySelector(".product-popup-details");

        if (!popup || !popupContent) {
          console.error("Product popup elements not found.");
          return;
        }

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
                ? `<span class="sale-price">Sale Price: $${(
                    product.price / 100
                  ).toFixed(2)}</span>
              <span class="original-price">Original Price: $${(
                product.compare_at_price / 100
              ).toFixed(2)}</span>`
                : `<span class="regular-price">Regular Price: $${(
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
        popup.style.display = "block";

        const popupAddToCartButton = document.querySelector(
          ".product-popup .add-to-cart"
        );
        popupAddToCartButton?.removeEventListener("click", handleAddToCart);
        popupAddToCartButton?.addEventListener("click", handleAddToCart);

        function handleAddToCart() {
          const productId = this.getAttribute("data-product-id");
          const quantity = document.getElementById("product-quantity-input")
            .value;
          addToCart(productId, parseInt(quantity));
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }

  document.querySelectorAll(".view-product").forEach((button) => {
    button.addEventListener("click", function () {
      const productHandle = this.getAttribute("data-product-handle");
      openProductPopup(productHandle);
    });
  });

  document
    .querySelector(".close-popup")
    ?.addEventListener("click", function () {
      document.getElementById("product-popup").style.display = "none";
    });

  window.addEventListener("click", function (event) {
    const popup = document.getElementById("product-popup");
    if (event.target === popup) {
      popup.style.display = "none";
    }
  });
}

// HAMBURGER MENU FUNCTIONALITY
function initHamburgerMenu() {
  const hamburgerButton = document.querySelector(".hamburger-menu");
  const closeButton = document.querySelector(".close-menu");
  const navMenu = document.getElementById("main-nav-menu");

  if (!hamburgerButton || !closeButton || !navMenu) {
    console.error("Required elements for the hamburger menu are missing.");
    return;
  }

  hamburgerButton.addEventListener("click", toggleMenu);
  closeButton.addEventListener("click", closeMenu);

  function toggleMenu() {
    navMenu.classList.toggle("active");
  }

  function closeMenu() {
    navMenu.classList.remove("active");
  }

  document.addEventListener("click", function (event) {
    if (
      !navMenu.contains(event.target) &&
      !event.target.closest(".hamburger-menu")
    ) {
      closeMenu();
    }
  });
}

// SHOW NOTIFICATION
function showNotification(message) {
  const notificationContainer = document.getElementById(
    "cart-notification-container"
  );
  if (!notificationContainer) {
    console.error("Notification container not found.");
    return;
  }

  notificationContainer.classList.add("fade-in");
  const notification = document.createElement("div");
  notification.className = "cart-notification";
  notification.innerHTML = `<p>${message}</p> <span class="notification-close"><i class="fa-solid fa-xmark"></i></span>`;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notificationContainer.classList.remove("fade-in");
    notificationContainer.classList.add("fade-out");
    notificationContainer.addEventListener("transitionend", () => {
      notificationContainer.classList.remove("fade-out");
      notification.remove();
    });
  }, 3000);

  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      notification.remove();
    });
}
