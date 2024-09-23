function updateCartCount(){fetch("/cart.js").then(t=>t.json()).then(t=>{console.log("Cart data:",t);var e,t=t.item_count,n=document.querySelector(".cart-icon .cart-count");n?n.textContent=t:(n=document.querySelector(".cart-icon"),(e=document.createElement("span")).classList.add("cart-count"),e.textContent=t,n.appendChild(e))}).catch(t=>console.error("Error fetching cart data:",t))}document.addEventListener("DOMContentLoaded",function(){updateCartCount(),document.addEventListener("cart:updated",updateCartCount)}),document.addEventListener("DOMContentLoaded",function(){var t=document.querySelector(".hamburger-menu"),e=document.querySelector(".close-menu");let n=document.getElementById("main-nav-menu");function o(){n.classList.remove("active")}t.addEventListener("click",function(){n.classList.toggle("active")}),e.addEventListener("click",o),document.addEventListener("click",function(t){n.contains(t.target)||t.target.closest(".hamburger-menu")||o()})}),document.addEventListener("DOMContentLoaded",function(){function o(t,e=1){fetch("/cart/add.js",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({id:t,quantity:e})}).then(t=>{if(t.ok)return t.json();throw new Error("Error adding product to cart: "+t.statusText)}).then(t=>{console.log("Product added:",t),alert("Product added to cart!"),updateCartCount(),document.dispatchEvent(new Event("cart:updated"))}).catch(t=>{console.error("Error adding to cart:",t),alert("There was an error adding the product to your cart. Please try again.")})}document.querySelectorAll(".add-to-cart").forEach(t=>{t.addEventListener("click",function(){var t=this.getAttribute("data-product-id");console.log("Adding product to cart:",t),o(t)})});document.querySelector(".close-popup").addEventListener("click",function(){document.getElementById("product-popup").style.display="none"}),window.addEventListener("click",function(t){var e=document.getElementById("product-popup");t.target===e&&(e.style.display="none")}),document.querySelectorAll(".view-product").forEach(t=>{t.addEventListener("click",function(){var t=this.getAttribute("data-product-handle");fetch(`/products/${t}.js`).then(t=>t.json()).then(t=>{var e=document.getElementById("product-popup"),e=(document.querySelector(".product-popup-details").innerHTML=`
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
      `,e.style.display="block",document.querySelector(".product-popup .add-to-cart"));function n(){var t=this.getAttribute("data-product-id"),e=document.getElementById("product-quantity-input").value;o(t,parseInt(e))}e.removeEventListener("click",n),e.addEventListener("click",n),document.querySelector(".product-popup .view-full-product").addEventListener("click",function(){window.location.href="/products/"+t.handle})}).catch(t=>console.error("Error fetching product details:",t))})})});
//# sourceMappingURL=main.js.map
