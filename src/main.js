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
        <div class="flex justify-between items-start pb-4 border-b border-rose-100">
          <div class="flex-1">
            <h3 class="font-semibold">${item.name}</h3>
            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-4">
                <span class="text-orange-800 text-sm font-semibold">${item.quantity}x</span>
                <span class="text-rose-400 text-sm">@ $${item.price.toFixed(2)}</span>
              </div>
              <span class="font-semibold">$${itemTotal.toFixed(2)}</span>
            </div>
          </div>
          <button class="remove-item text-rose-400 hover:text-red ml-4" data-id="${item.id}">
            <img src="./assets/images/icon-remove-item.svg" alt="Remove item" class="w-4 h-4" />
          </button>
        </div>
        `;
      });

      cartHTML += `
        </div>
        <div class="mt-6">
          <div class="flex justify-between items-center font-semibold">
            <span>Order Total</span>
            <span class="text-lg">$${totalPrice.toFixed(2)}</span>
          </div>
          <div class="mt-4 bg-rose-50 p-3 rounded-lg flex items-center justify-center gap-2 text-sm text-rose-500">
            <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon-neutral" class="w-4 h-4" />
            This is a <span class="font-semibold">carbon-neutral</span> delivery
          </div>
          <button id="confirmOrder" class="mt-4 bg-red text-white py-3 w-full rounded-xl font-semibold hover:bg-rose-900 transition-colors">
            Confirm Order
          </button>
        </div>
      `;

      cartContainer.innerHTML = cartHTML;

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
    updateProductCardBorder(product.id);
  }

  function removeFromCart(id) {
    delete cart[id];
    updateCartDisplay();
    resetAddToCartButton(id);
    updateProductCardBorder(id);
  }

  function updateAddToCartButton(id) {
    const buttons = document.querySelectorAll(".add-to-cart-btn");

    buttons.forEach((button) => {
      const buttonId = button.getAttribute("data-id");

      if (buttonId === id) {
        if (cart[id]) {
          button.innerHTML = `
            <div class="flex items-center justify-between w-full px-1">
              <button class="decrease-quantity w-6 h-6 flex items-center justify-center p-0" data-id="${id}">
                <img src="./assets/images/icon-decrement-quantity.svg" alt="Decrease quantity" class="w-3 h-3" />
              </button>
              <span class="font-semibold text-sm mx-1">${cart[id].quantity}</span>
              <button class="increase-quantity w-6 h-6 flex items-center justify-center p-0" data-id="${id}">
                <img src="./assets/images/icon-increment-quantity.svg" alt="Increase quantity" class="w-3 h-3" />
              </button>
            </div>
          `;

          button.classList.remove("hover:border-red", "hover:text-red");
          button.classList.add("border-red", "bg-red", "text-white");

          button.querySelector(".decrease-quantity").addEventListener("click", (e) => {
            e.stopPropagation();
            decreaseQuantity(id);
          });

          button.querySelector(".increase-quantity").addEventListener("click", (e) => {
            e.stopPropagation();
            increaseQuantity(id);
          });
        }
      }
    });
  }

  function decreaseQuantity(id) {
    if (cart[id]) {
      cart[id].quantity -= 1;
      if (cart[id].quantity <= 0) {
        delete cart[id];
        resetAddToCartButton(id);
        updateProductCardBorder(id);
      } else {
        updateAddToCartButton(id);
      }
      updateCartDisplay();
    }
  }

  function increaseQuantity(id) {
    if (cart[id]) {
      cart[id].quantity += 1;
      updateAddToCartButton(id);
      updateCartDisplay();
    }
  }

  function resetAddToCartButton(id) {
    const buttons = document.querySelectorAll(".add-to-cart-btn");

    buttons.forEach((button) => {
      const buttonId = button.getAttribute("data-id");

      if (buttonId === id) {
        button.innerHTML = `
          <img src="./assets/images/icon-add-to-cart.svg" alt="Add to cart" class="w-4 h-4" />
          Add to Cart
        `;
        button.classList.remove("border-red", "bg-red", "text-white");
        button.classList.add("hover:border-red", "hover:text-red");
        button.addEventListener("click", handleAddToCart);
      }
    });
  }

  function updateProductCardBorder(id) {
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      const cardId = card.getAttribute("data-id");

      if (cart[cardId]) {
        card.classList.add("border-red");
        card.classList.remove("border-rose-100");
      } else {
        card.classList.remove("border-red");
        card.classList.add("border-rose-100");
      }
    });
  }

  function getProductImage(productId) {
    const imageMap = {
      "waffle-with-berries": "./assets/images/image-waffle-desktop.jpg",
      "vanilla-bean-creme-brulee": "./assets/images/image-creme-brulee-desktop.jpg",
      "pistachio-baklava": "./assets/images/image-baklava-desktop.jpg",
      "macaron-mix-of-five": "./assets/images/image-macaron-desktop.jpg",
      "red-velvet-cake": "./assets/images/image-cake-desktop.jpg",
      "salted-caramel-brownie": "./assets/images/image-brownie-desktop.jpg",
      "classic-tiramisu": "./assets/images/image-tiramisu-desktop.jpg",
      "lemon-meringue-pie": "./assets/images/image-meringue-desktop.jpg",
      "vanilla-panna-cotta": "./assets/images/image-panna-cotta-desktop.jpg",
    };

    return imageMap[productId] || "./assets/images/illustration-empty-cart.svg";
  }

  function confirmOrder() {
    if (Object.keys(cart).length === 0) return;

    const cartItems = Object.values(cart);
    let totalPrice = 0;
    let orderSummaryHTML = `
      <div class="mb-6 bg-rose-50 rounded-xl p-6 border border-rose-50">
        <div class="space-y-4">
    `;

    cartItems.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;
      const productImage = getProductImage(item.id);

      orderSummaryHTML += `
        <div class="grid grid-cols-[auto_1fr_auto] items-start gap-4 pb-4 border-b border-rose-100 last:border-b-0">
          <img src="${productImage}" alt="${item.name}" class="w-12 h-12 rounded-lg object-cover" />
          <div class="min-w-0">
            <h3 class="font-semibold text-gray-900 mb-1 truncate">${item.name}</h3>
            <div class="flex items-center gap-2">
              <span class="text-orange-800 text-sm font-semibold">${item.quantity}x</span>
              <span class="text-rose-400 text-sm">@ $${item.price.toFixed(2)}</span>
            </div>
          </div>
          <span class="font-semibold text-gray-900 whitespace-nowrap">$${itemTotal.toFixed(2)}</span>
        </div>
      `;
    });

    orderSummaryHTML += `
        </div>
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-rose-200">
          <span class="text-md text-gray-900 font-bold">Order Total</span>
          <span class="text-lg font-bold text-gray-900">$${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    `;

    const modal = document.createElement("div");
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md w-full">
        <div class="flex items-center justify-center mb-4">
          <img src="./assets/images/icon-order-confirmed.svg" alt="Order confirmed" class="w-16 h-16" />
        </div>
        <h3 class="text-xl font-bold text-center mb-2">Order Confirmed</h3>
        <p class="text-rose-500 text-center mb-6">We hope you enjoy your food!</p>
        ${orderSummaryHTML}
        <div class="text-center">
          <button id="closeModal" class="bg-red text-white py-3 px-8 rounded-xl font-semibold hover:bg-rose-900 transition-colors">
            Start New Order
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("closeModal").addEventListener("click", () => {
      document.body.removeChild(modal);
      cart = {};
      updateCartDisplay();

      document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        const buttonId = button.getAttribute("data-id");
        resetAddToCartButton(buttonId);
      });

      updateProductCardBorder();
    });
  }

  function handleAddToCart(e) {
    const button = e.currentTarget;
    const productCard = button.closest(".product-card");
    const productName = productCard.querySelector("h3").textContent;
    const productPrice = parseFloat(productCard.querySelector(".text-red").textContent.replace("$", ""));
    const productId = button.getAttribute("data-id");

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
    };

    addToCart(product);
  }

  function initializeAddToCartButtons() {
    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
      button.removeEventListener("click", handleAddToCart);
      button.addEventListener("click", handleAddToCart);
    });
  }

  initializeAddToCartButtons();
  updateCartDisplay();
});
