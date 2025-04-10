function renderOrderSummary() {
    const orderSummaryEl = document.getElementById('orderSummary');
    const productJSON = sessionStorage.getItem('selectedProduct');
    let html = "";

    if (productJSON) {
        const product = JSON.parse(productJSON);
        console.log("Selected product:", product);

        const rentPricePerDay = parseFloat(product.rentPrice.replace(/\D/g, "")) || 0;
        const days = product.quantity || 1;
        const totalRentForItem = rentPricePerDay * days;

        html += `
            <div class="product-box">
                <img src="${product.img}" alt="${product.title}" />
                <div class="product-info">
                    <p class="product-name">${product.title}</p>
                    <p class="product-size">Розмір: ${product.size || 'XS'}</p>
                    <p class="product-quantity">Дні: ${days}</p>
                    <p class="product-rent">Оренда: ${totalRentForItem} грн</p>
                </div>
            </div>
        `;
        html += `<div class="order-total">
                    <span>Всього до оплати:</span>
                    <strong>${totalRentForItem} грн</strong>
                 </div>`;
    } else {
        html = `<p>Немає інформації про товар</p>`;
    }
    orderSummaryEl.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);


document.getElementById("placeOrderBtn").addEventListener("click", async function(event) {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("deliveryAddress").value.trim();

    if (!name || !email || !phone || !address) {
        alert("Будь ласка, заповніть усі обов’язкові поля.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Будь ласка, введіть дійсний email.");
        return;
    }


    const phoneRegex = /^\+?\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
        alert("Будь ласка, введіть дійсний номер телефону (10-15 цифр, допускається символ + на початку).");
        return;
    }


    const order = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        delivery: document.querySelector('input[name="delivery"]:checked').value,
        address: address,
        payment: document.querySelector('input[name="payment"]:checked').value,
        comment: document.getElementById("comment").value.trim(),
        cart: JSON.parse(localStorage.getItem("cart")) || []
    };

    try {

        const res = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        const data = await res.json();
        console.log("Server response:", data);
    } catch (err) {
        console.error("Помилка надсилання замовлення:", err);
        alert("Сталася помилка при оформленні замовлення.");
        return;
    }

    alert("Ваше замовлення успішно оформлене");
    window.location.href = "order-history.html";
});
