function initCart(){let n=document.querySelector(".cart-icon");var t=document.querySelector(".close-cart");let e=document.getElementById("cart-sidebar");function r(){fetch("/cart.js").then(t=>t.json()).then(t=>{var t=t.item_count,e=document.querySelector(".cart-icon .cart-count");e?e.textContent=t:((e=document.createElement("span")).classList.add("cart-count"),e.textContent=t,n.appendChild(e))}).catch(t=>console.error("Error fetching cart data:",t))}function o(){fetch("/cart.js").then(t=>t.json()).then(t=>{let e=document.querySelector(".cart-items");var n=document.querySelector(".cart-total-price");e&&n&&(e.innerHTML="",0===t.item_count?(e.innerHTML="<p>Your cart is empty.</p>",n.textContent="$0.00"):(t.items.forEach(t=>{t=`
              <div class="cart-item">
                <img src="${t.image}" alt="${t.title}">
                <div class="cart-item-details-wrap">
                  <div class="cart-item-details">
                    <h4>${t.title}</h4>
                    <p class="cart-item-qp">${t.quantity} x $${(t.price/100).toFixed(2)}</p>
                    <button type="button" class="btn-remove-item" data-line="${t.key}"><i class="fa-solid fa-xmark"></i></button>
                  </div>
                  <div class="cart-item-total">
                    $${(t.price*t.quantity/100).toFixed(2)}
                  </div>
                </div>
              </div>
            `;e.insertAdjacentHTML("beforeend",t)}),n.textContent="$"+(t.total_price/100).toFixed(2),document.querySelectorAll(".btn-remove-item").forEach(t=>{t.addEventListener("click",function(){var t=this.getAttribute("data-line");fetch("/cart/change.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({id:t,quantity:0})}).then(t=>{if(t.ok)return t.json();throw new Error("Error removing item from cart: "+t.statusText)}).then(()=>{showNotification("Item removed from cart!"),r(),o(),document.dispatchEvent(new Event("cart:updated"))}).catch(t=>{console.error("Error removing item from cart:",t),showNotification("There was an error removing the item from your cart.")})})})))}).catch(t=>{console.error("Error fetching cart data:",t)})}n?.addEventListener("click",function(t){t.preventDefault(),e&&(e.classList.toggle("active"),document.body.classList.toggle("cart-sidebar-active"),o())}),t?.addEventListener("click",function(){e&&(e.classList.remove("active"),document.body.classList.remove("cart-sidebar-active"))}),r(),o(),document.addEventListener("cart:updated",o),window.updateCartCount=r}function initProductFunctionality(){function o(t,e=1){fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({id:t,quantity:e})}).then(t=>{if(t.ok)return t.json();throw new Error("Error adding product to cart: "+t.statusText)}).then(()=>{showNotification("Product added to cart!"),updateCartCount(),document.dispatchEvent(new Event("cart:updated"))}).catch(t=>{console.error("Error adding to cart:",t),showNotification("There was an error adding the product to your cart.")})}document.querySelectorAll(".add-to-cart").forEach(t=>{t.addEventListener("click",function(){o(this.getAttribute("data-product-id"))})}),document.querySelectorAll(".view-product").forEach(t=>{t.addEventListener("click",function(){var t=this.getAttribute("data-product-handle");fetch(`/products/${t}.js`).then(t=>t.json()).then(t=>{var e=document.getElementById("product-popup"),n=document.querySelector(".product-popup-details");function r(){var t=this.getAttribute("data-product-id"),e=document.getElementById("product-quantity-input").value;o(t,parseInt(e))}e&&n?(n.innerHTML=`
        <div class="product-popup-left">
          <img src="${t.images[0]}" alt="${t.title}">
        </div>
        <div class="product-popup-right">
          <h2>${t.title}</h2>
          <p>${t.description}</p>
          <div class="popup-price">
            ${t.compare_at_price?`<span class="sale-price">Sale Price: $${(t.price/100).toFixed(2)}</span>
              <span class="original-price">Original Price: $${(t.compare_at_price/100).toFixed(2)}</span>`:`<span class="regular-price">Regular Price: $${(t.price/100).toFixed(2)}</span>`}
          </div>
          <div class="product-quantity">
            <label for="product-quantity-input">Quantity</label>
            <input type="number" id="product-quantity-input" value="1" min="1">
          </div>
          <div class="product-popup-btns">
            <button type="button" class="btn-primary add-to-cart" data-product-id="${t.variants[0].id}">Add to Cart</button>
            <button type="button" class="btn-primary view-full-product" data-product-handle="${t.handle}">View Full Product</button>
          </div>
        </div>
      `,e.style.display="block",(n=document.querySelector(".product-popup .add-to-cart"))?.removeEventListener("click",r),n?.addEventListener("click",r)):console.error("Product popup elements not found.")}).catch(t=>{console.error("Error fetching product details:",t)})})}),document.querySelector(".close-popup")?.addEventListener("click",function(){document.getElementById("product-popup").style.display="none"}),window.addEventListener("click",function(t){var e=document.getElementById("product-popup");t.target===e&&(e.style.display="none")})}function initHamburgerMenu(){var t=document.querySelector(".hamburger-menu"),e=document.querySelector(".close-menu");let n=document.getElementById("main-nav-menu");function r(){n.classList.remove("active")}t&&e&&n?(t.addEventListener("click",function(){n.classList.toggle("active")}),e.addEventListener("click",r),document.addEventListener("click",function(t){n.contains(t.target)||t.target.closest(".hamburger-menu")||r()})):console.error("Required elements for the hamburger menu are missing.")}function showNotification(e){let n=document.getElementById("cart-notification-container");if(n){n.classList.add("fade-in");let t=document.createElement("div");t.className="cart-notification",t.innerHTML=`<p>${e}</p> <span class="notification-close"><i class="fa-solid fa-xmark"></i></span>`,n.appendChild(t),setTimeout(()=>{n.classList.remove("fade-in"),n.classList.add("fade-out"),n.addEventListener("transitionend",()=>{n.classList.remove("fade-out"),t.remove()})},3e3),t.querySelector(".notification-close").addEventListener("click",()=>{t.remove()})}else console.error("Notification container not found.")}document.addEventListener("DOMContentLoaded",function(){initCart(),initProductFunctionality(),initHamburgerMenu()});
//# sourceMappingURL=main.js.map
