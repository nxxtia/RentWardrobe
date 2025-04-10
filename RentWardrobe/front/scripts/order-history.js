async function loadOrders() {
    try {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const res = await fetch(`/api/user/${currentUserEmail}/orders`);
        const ordersHistory = await res.json();
        const container = document.getElementById('ordersList');
        if (!ordersHistory.length) {
            container.innerHTML = '<p>У вас ще немає замовлень.</p>';
            return;
        }
        container.innerHTML = "";
        ordersHistory.forEach(order => {
            const div = document.createElement('div');
            div.className = 'order-card';
            div.innerHTML = `
            <h4>Замовлення №${order.id}</h4>
            <p><strong>Ім’я:</strong> ${order.name}</p>
            <p><strong>Телефон:</strong> ${order.phone}</p>
            <p><strong>Доставка:</strong> ${order.delivery} (${order.address})</p>
            <p><strong>Оплата:</strong> ${order.payment}</p>
            <p><strong>Коментар:</strong> ${order.comment || '-'}</p>
            <h5>Товари:</h5>
            <ul>
              ${order.cart.map(item => `<li>${item.title} — ${item.quantity} дні — ${item.rentPrice}</li>`).join('')}
            </ul>
          `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error('Помилка при завантаженні замовлень:', err);
    }
}
window.onload = loadOrders;