function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = "";
    let totalRentSum = 0;

    cart.forEach((item, index) => {
        const buyPrice = item.price || "";
        const rentPricePerDay = parseFloat(item.rentPrice.replace(/\D/g, "")) || 0;
        const days = item.quantity;
        const totalRentForItem = rentPricePerDay * days;
        totalRentSum += totalRentForItem;

        let sizeSelectorHTML = "";
        if (item.sizes && Array.isArray(item.sizes)) {
            sizeSelectorHTML = `<select class="size-dropdown" data-index="${index}">
            ${item.sizes.map(sizeValue => {
                const selected = (sizeValue === item.size) ? "selected" : "";
                return `<option value="${sizeValue}" ${selected}>${sizeValue}</option>`;
            }).join("")}
            </select>`;
        } else {
            sizeSelectorHTML = `<span>${item.size || "XS"}</span>`;
        }

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <div class="item-image">
                <img src="${item.img}" alt="${item.title}" />
            </div>
            <div class="item-right">
                <div class="item-upper">
                    <div class="item-quantity">
                        <span>Кількість днів оренди:</span>
                        <input type="number" value="${days}" min="1" data-index="${index}" class="quantity-input" />
                    </div>
                    <div class="item-total-price">
                        <span>Вартість оренди:</span>
                        <strong>${totalRentForItem} грн</strong>
                    </div>
                    <button class="delete-item-btn" data-index="${index}" title="Видалити">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
                <div class="item-details">
                    <p class="item-name">${item.title}</p>
                    ${buyPrice ? `<p class="item-full-price">Повна ціна: ${buyPrice}</p>` : ""}
                    <div class="item-size">
                        <span>Розмір:</span> ${sizeSelectorHTML}
                    </div>
                    <p class="item-rent-price">Оренда за добу: ${item.rentPrice}</p>
                  
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });
    document.getElementById("totalPrice").textContent = totalRentSum + " грн";
    attachDeleteEvent();
    attachQuantityChangeEvent();
    attachDropdownChangeEvent();
}

function attachDeleteEvent() {
    const deleteButtons = document.querySelectorAll(".delete-item-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        });
    });
}

function attachQuantityChangeEvent() {
    const quantityInputs = document.querySelectorAll(".quantity-input");
    quantityInputs.forEach(input => {
        input.addEventListener("change", function () {
            const newQuantity = parseInt(this.value);
            const index = this.getAttribute("data-index");
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            if (newQuantity < 1) {
                this.value = cart[index].quantity;
                return;
            }
            cart[index].quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        });
    });
}

function attachDropdownChangeEvent() {
    const dropdowns = document.querySelectorAll(".size-dropdown");
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("change", function () {
            const index = this.getAttribute("data-index");
            const selectedSize = this.value;
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            cart[index].size = selectedSize;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        });
    });
}

document.addEventListener("DOMContentLoaded", renderCartItems);
