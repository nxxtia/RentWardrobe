// Логіка вкладок: перемикання активних кнопок та вмісту
const tabLinks = document.querySelectorAll('.tab-link');
const tabContents = document.querySelectorAll('.tab-content');
tabLinks.forEach((btn) => {
    btn.addEventListener('click', () => {
        tabLinks.forEach((item) => item.classList.remove('active'));
        btn.classList.add('active');
        tabContents.forEach((content) => content.classList.remove('active'));
        const tabId = btn.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    });
});

const productJSON = sessionStorage.getItem('selectedProduct');
let product;
if (productJSON) {
    product = JSON.parse(productJSON);
    document.getElementById('breadcrumbTitle').textContent = product.title;
    document.getElementById('productTitle').textContent = product.title;
    document.getElementById('mainPhoto').src = product.img;
    document.getElementById('productPrice').textContent = product.price;
    document.getElementById('productCode').textContent = 'Код: ' + (product.code || 'NO-000000');
    document.getElementById('rentPrice').textContent = product.rentPrice || '1000 грн/добу';
    document.getElementById('descriptionText').textContent = product.description;

    const sizesBlock = document.querySelector('.sizes');
    sizesBlock.innerHTML = ''; // очищення списку кнопок розмірів

    if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => {
            const button = document.createElement('button');
            button.className = 'size-btn';
            button.textContent = size;
            sizesBlock.appendChild(button);
        });
    }
    product.rating = product.rating || 5;
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
}

const buy1ClickBtn = document.querySelector('.buy-1-click');
buy1ClickBtn.addEventListener('click', function() {
    // Додатково можна зчитувати вибраний розмір, якщо кнопка активна
    const selectedSizeBtn = document.querySelector('.size-btn.active');
    if (selectedSizeBtn) {
        product.size = selectedSizeBtn.textContent;
    } else {
        product.size = product.size || 'XS';
    }
    product.quantity = 1;

    sessionStorage.setItem('selectedProduct', JSON.stringify(product));

    window.location.href = 'checkout.html';
});

document.addEventListener('click', (e) => {
    if (e.target.matches('.size-btn')) {
        const allSizeButtons = document.querySelectorAll('.size-btn');
        allSizeButtons.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }
});


document.querySelector('.add-to-cart').addEventListener('click', function() {
    const productJSON = sessionStorage.getItem('selectedProduct');
    if (productJSON) {
        const product = JSON.parse(productJSON);
        product.quantity = 1;
        const selectedSizeBtn = document.querySelector('.size-btn.active');
        product.size = selectedSizeBtn ? selectedSizeBtn.textContent : (product.size || 'N/A');
        product.rating = product.rating || 5;
        product.rentPrice = product.rentPrice || '1000 грн/добу';

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.code === product.code && item.size === product.size);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар додано до кошика!');
    } else {
        alert('Дані про товар не знайдено!');
    }
});

function handleProfileClick(event) {
    event.preventDefault();
    window.location.href = 'userProfile.html';
}
document.getElementById('profileLink').addEventListener('click', handleProfileClick);
document.getElementById('profileLinkIcon').addEventListener('click', handleProfileClick);
