const appliedFilters = {
    category: null,
    color: null,
    size: null,
    search: null
};

function getQueryParams() {
    const params = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => {
        params[key] = value;
    });
    return params;
}

function updateBreadcrumbs() {
    const breadcrumbLink = document.getElementById('breadcrumbCategory');
    if (appliedFilters.category) {
        const categoryMapping = {
            'women': 'Жіночий одяг',
            'men': 'Чоловічий одяг',
            'evening': 'Вечірні сукні',
            'accessories': 'Аксесуари',
            'suits': 'Костюми',
            'womanShoes': 'Взуття жіноче',
            'manShoes': 'Взуття чоловіче'
        };
        breadcrumbLink.textContent = categoryMapping[appliedFilters.category] || appliedFilters.category;
    } else {
        breadcrumbLink.textContent = 'Усі Товари';
    }
}

function applyFilters(allProducts) {
    let filteredProducts = allProducts.slice();

    if (appliedFilters.category) {
        if (appliedFilters.category === 'women') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('NO-') || product.code.startsWith('ACC-') || product.code.startsWith('WSH-')
            );
        } else if (appliedFilters.category === 'men') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('MSC-') || product.code.startsWith('MSH-')
            );
        } else if (appliedFilters.category === 'evening') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('NO-')
            );
        } else if (appliedFilters.category === 'accessories') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('ACC-')
            );
        } else if (appliedFilters.category === 'suits') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('MSC-')
            );
        } else if (appliedFilters.category === 'womanShoes') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('WSH-')
            );
        } else if (appliedFilters.category === 'manShoes') {
            filteredProducts = filteredProducts.filter(product =>
                product.code.startsWith('MSH-')
            );
        }
    }

    if (appliedFilters.color) {
        const colorMapping = {
            'чорний': 'чор',
            'білий': 'біл',
            'червоний': ['черв','баг'],
            'синій': 'син',
            'коричневий': 'кор',
            'сірий': 'сір'
        };
        const filterText = appliedFilters.color.toLowerCase();
        const stem = colorMapping[filterText] || filterText;
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(stem)
        );
    }

    if (appliedFilters.size) {
        filteredProducts = filteredProducts.filter(product =>
            Array.isArray(product.sizes) && product.sizes.includes(appliedFilters.size)
        );
    }

    if (appliedFilters.search) {
        const query = appliedFilters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.title.toLowerCase().includes(query)
        );
    }

    const sortOption = document.getElementById('sortSelect').value;
    if (sortOption === 'price-asc') {
        filteredProducts.sort((a, b) => {
            const priceA = parseInt((a.price || '').replace(/\D/g, ''), 10);
            const priceB = parseInt((b.price || '').replace(/\D/g, ''), 10);
            return priceA - priceB;
        });
    } else if (sortOption === 'price-desc') {
        filteredProducts.sort((a, b) => {
            const priceA = parseInt((a.price || '').replace(/\D/g, ''), 10);
            const priceB = parseInt((b.price || '').replace(/\D/g, ''), 10);
            return priceB - priceA;
        });
    }

    displayProducts(filteredProducts);
    updateBreadcrumbs();
}

function displayProducts(products) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product', JSON.stringify(product));
        card.innerHTML = `
      <i class="fa-regular fa-heart heart-icon"></i>
      <img src="${product.img}" alt="${product.title}" />
      <h3>${product.title}</h3>
      <button class="details-btn">Детальніше</button>
    `;
        grid.appendChild(card);
    });
    attachDetailsHandlers();
    initHeartIcons();
}

function attachDetailsHandlers() {
    const detailButtons = document.querySelectorAll('.details-btn');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productData = productCard.getAttribute('data-product');
            sessionStorage.setItem('selectedProduct', productData);
            window.location.href = 'product.html';
        });
    });
}

async function loadProducts() {
    try {
        const res = await fetch('/api/products');
        const products = await res.json();
        sessionStorage.setItem('allProducts', JSON.stringify(products));

        const params = getQueryParams();
        if (params.category) {
            if (params.category === 'women' || params.category === 'men') {
                appliedFilters.category = params.category;
                appliedFilters.color = null;
                appliedFilters.size = null;
                appliedFilters.search = null;
                applyFilters(products);
            } else {
                displayProducts(products);
            }
        } else {
            displayProducts(products);
        }
    } catch (err) {
        console.error('Помилка при завантаженні товарів', err);
    }
}

function setActiveFilter(element, selectorGroup) {
    const items = document.querySelectorAll(selectorGroup);
    items.forEach(item => item.classList.remove('active'));
    element.classList.add('active');
}

function toggleFilter(filterName, value) {
    if (appliedFilters[filterName] === value) {
        appliedFilters[filterName] = null;
    } else {
        appliedFilters[filterName] = value;
    }
}

function toggleCategory(value) {
    if (appliedFilters.category === value) {
        appliedFilters.color = null;
        appliedFilters.size = null;
        appliedFilters.search = null;
    } else {
        appliedFilters.category = value;
        appliedFilters.color = null;
        appliedFilters.size = null;
        appliedFilters.search = null;
    }
}

document.getElementById('eveningDressesLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCategory('evening');
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});
document.getElementById('accessoriesLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCategory('accessories');
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});
document.getElementById('suitsLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCategory('suits');
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});
document.getElementById('womanShoesLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCategory('womanShoes');
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});
document.getElementById('manShoesLink').addEventListener('click', function(e) {
    e.preventDefault();
    toggleCategory('manShoes');
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});

const colorLinks = document.querySelectorAll('.color-filter');
colorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        toggleFilter('color', this.getAttribute('data-color'));
        setActiveFilter(this, '.color-filter');
        const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
        applyFilters(allProducts);
    });
});

const sizeLinks = document.querySelectorAll('.size-filter');
sizeLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        toggleFilter('size', this.getAttribute('data-size'));
        setActiveFilter(this, '.size-filter');
        const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
        applyFilters(allProducts);
    });
});

document.getElementById('searchInput').addEventListener('input', function () {
    appliedFilters.search = this.value.trim();
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});

document.getElementById('toggleSearch').addEventListener('click', function (e) {
    e.preventDefault();
    const input = document.getElementById('searchInput');
    input.style.display = input.style.display === 'none' ? 'inline-block' : 'none';
    input.focus();
});

function handleProfileClick(event) {
    event.preventDefault();
    window.location.href = 'userProfile.html';
}
document.getElementById('profileLink').addEventListener('click', handleProfileClick);
document.getElementById('profileLinkIcon').addEventListener('click', handleProfileClick);

async function initHeartIcons() {
    const email = localStorage.getItem('currentUserEmail');
    const heartIcons = document.querySelectorAll('.heart-icon');
    let favorites = [];
    if (email) {
        try {
            const res = await fetch(`/api/user/${email}`);
            const user = await res.json();
            favorites = user.favorites || [];
        } catch (err) {
            console.error('Помилка при отриманні favorites', err);
        }
    }
    heartIcons.forEach(icon => {
        const productCard = icon.closest('.product-card');
        const productData = JSON.parse(productCard.getAttribute('data-product'));
        if (favorites.includes(productData.code)) {
            icon.classList.remove('fa-regular');
            icon.classList.add('fa-solid');
        }
        icon.addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!email) {
                alert('Будь ласка, увійдіть в акаунт, щоб додавати в обране.');
                return;
            }
            if (icon.classList.contains('fa-regular')) {
                try {
                    const res = await fetch(`/api/user/${email}/favorites`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ productCode: JSON.parse(productCard.getAttribute('data-product')).code })
                    });
                    if (res.ok) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                    }
                } catch (err) {
                    console.error('Помилка при додаванні в обране', err);
                }
            } else {
                try {
                    const res = await fetch(`/api/user/${email}/favorites/${JSON.parse(productCard.getAttribute('data-product')).code}`, {
                        method: 'DELETE'
                    });
                    if (res.ok) {
                        icon.classList.remove('fa-solid');
                        icon.classList.add('fa-regular');
                    }
                } catch (err) {
                    console.error('Помилка при видаленні з обраного', err);
                }
            }
        });
    });
}

window.onload = loadProducts;

document.getElementById('sortSelect').addEventListener('change', function () {
    const allProducts = JSON.parse(sessionStorage.getItem('allProducts')) || [];
    applyFilters(allProducts);
});
