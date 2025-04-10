const currentUserEmail = localStorage.getItem('currentUserEmail');

async function loadFavorites() {
    if (!currentUserEmail) return;

    try {
        const userRes = await fetch(`/api/user/${currentUserEmail}`);
        const user = await userRes.json();

        const grid = document.getElementById('favoritesGrid');
        grid.innerHTML = '';

        const productsRes = await fetch('/api/products');
        const allProducts = await productsRes.json();

        const favoriteProducts = allProducts.filter(p => user.favorites.includes(p.code));

        if (!favoriteProducts.length) {
            grid.innerHTML = '<p>У вас поки що немає обраних товарів.</p>';
            return;
        }

        favoriteProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-product', JSON.stringify(product));
            card.innerHTML = `
                    <i class="fa-solid fa-heart heart-icon"></i>
                    <img src="${product.img}" alt="${product.title}" />
                    <h3>${product.title}</h3>
                    <button class="details-btn">Детальніше</button>
                    <button class="remove-btn" onclick="removeFromFavorites('${product.code}')">Видалити</button>
                `;
            grid.appendChild(card);
        });

        const detailButtons = document.querySelectorAll('.details-btn');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productData = productCard.getAttribute('data-product');
                sessionStorage.setItem('selectedProduct', productData);
                window.location.href = 'product.html';
            });
        });
    } catch (err) {
        console.error('Помилка при завантаженні обраних товарів', err);
    }
}

async function viewProduct(code) {
    try {
        const res = await fetch('/api/products');
        const allProducts = await res.json();
        const selected = allProducts.find(p => p.code === code);
        if (selected) {
            sessionStorage.setItem('selectedProduct', JSON.stringify(selected));
            window.location.href = 'product.html';
        }
    } catch (err) {
        console.error('Помилка при переході до товару', err);
    }
}

async function removeFromFavorites(code) {
    const email = localStorage.getItem('currentUserEmail');
    if (!email) return;

    try {
        const res = await fetch(`/api/user/${email}/favorites/${code}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            loadFavorites();
        }
    } catch (err) {
        console.error('Помилка при видаленні з обраного', err);
    }
}

window.onload = loadFavorites;