document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".lg\\:w-1\\/3 > .bg-white");
  let cart = {};

  function updateCartDisplay() {
    const cartItems = Object.values(cart);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems === 0) {
      cartContainer.innerHTML = `
        <h2 class="text-xl font-bold mb-4">Your Cart (0)</h2>
        <div class="text-center py-8">
          <div class="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <img src="./assets/images/illustration-empty-cart.svg" alt="Empty cart" class="w-12 h-12" />
          </div>
          <p class="text-rose-500">Your added items will appear here</p>
        </div>
      `;
    } else {
      let cartHTML = `
        <h2 class="text-xl font-bold mb-4">Your Cart (${totalItems})</h2>
        <div class="space-y-4">
      `;

      let totalPrice = 0;

      cartItems.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        cartHTML += `
          <div class="flex justify-between items-center">
            <div>
              <h3 class="font-semibold">${item.name}</h3>
              <div class="flex items-center gap-4 mt-1">
                <div class="flex items-center gap-2">
                  <button class="quantity-btn decrease text-rose-500 hover:text-red font-bold" data-id="${item.id}">-</button>
                  <span class="font-semibold">${item.quantity}</span>
                  <button class="quantity-btn increase text-rose-500 hover:text-red font-bold" data-id="${item.id}">+</button>
                </div>
                <span class="text-rose-500">@ $${item.price.toFixed(2)}</span>
                <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
              </div>
            </div>
            <button class="remove-item text-rose-400 hover:text-red" data-id="${item.id}">
              <img src="./assets/images/icon-remove-item.svg" alt="Remove item" class="w-4 h-4" />
            </button>
          </div>
        `;
      });

      cartHTML += `
        </div>
        <div class="border-t border-rose-100 mt-4 pt-4">
          <div class="flex justify-between items-center font-semibold">
            <span>Order Total</span>
            <span class="text-lg">$${totalPrice.toFixed(2)}</span>
          </div>
          <div class="mt-3 bg-rose-50 p-3 rounded-lg text-center text-sm text-rose-500">
           <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon-neutral" class="w-8 h-8" />
            This is a <span class="font-semibold">carbon-neutral</span> delivery
          </div>
          <button id="confirmOrder" class="mt-4 bg-red text-white py-3 w-full rounded-xl font-semibold hover:bg-rose-900 transition-colors">
            Confirm Order
          </button>
        </div>
      `;

      cartContainer.innerHTML = cartHTML;

      document.querySelectorAll(".quantity-btn.increase").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          increaseQuantity(id);
        });
      });

      document.querySelectorAll(".quantity-btn.decrease").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.target.getAttribute("data-id");
          decreaseQuantity(id);
        });
      });

      document.querySelectorAll(".remove-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const id = e.currentTarget.getAttribute("data-id");
          removeFromCart(id);
        });
      });

      document.getElementById("confirmOrder").addEventListener("click", confirmOrder);
    }
  }

  function addToCart(product) {
    if (cart[product.id]) {
      cart[product.id].quantity += 1;
    } else {
      cart[product.id] = {
        ...product,
        quantity: 1,
      };
    }
    updateCartDisplay();
    updateAddToCartButton(product.id);
  }

  function increaseQuantity(id) {
    if (cart[id]) {
      cart[id].quantity += 1;
      updateCartDisplay();
      updateAddToCartButton(id);
    }
  }

  function decreaseQuantity(id) {
    if (cart[id]) {
      cart[id].quantity -= 1;
      if (cart[id].quantity <= 0) {
        delete cart[id];
        resetAddToCartButton(id);
      }
      updateCartDisplay();
      updateAddToCartButton(id);
    }
  }

  function removeFromCart(id) {
    delete cart[id];
    updateCartDisplay();
    resetAddToCartButton(id);
  }

  function handleAddToCart(e) {
    const productCard = e.currentTarget.closest(".bg-white.rounded-2xl");
    const productName = productCard.querySelector("h3").textContent;
    const productPrice = parseFloat(productCard.querySelector(".text-red").textContent.replace("$", ""));
    const productId = productName.toLowerCase().replace(/\s+/g, "-");

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
    };

    addToCart(product);
  }

  function initializeAddToCartButtons() {
    document.querySelectorAll(".relative button").forEach((button) => {
      button.removeEventListener("click", handleAddToCart);
      button.addEventListener("click", handleAddToCart);
    });
  }

  initializeAddToCartButtons();
  updateCartDisplay();
});
