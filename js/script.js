let cart = [];
let currentSelectedSize = 'M';

// 1. WYŚWIETLANIE PRODUKTÓW NA STRONIE
function renderProducts() {
    const grid = document.getElementById('merch-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="openProductModal('${p.id}')">
            <div class="product-img-container">
                <img src="${p.mainImg}" alt="${p.title}">
            </div>
            <h2>${p.title}</h2>
            <div class="price">${p.price.toFixed(2)} PLN</div>
            <button class="buy-btn" onclick="event.stopPropagation(); addToCart('${p.id}', '${p.sizes[0]}')">Szybki zakup</button>
        </div>
    `).join('');
}

// 2. OTWIERANIE OKNA PRODUKTU (MODAL)
function openProductModal(id) {
    const p = products.find(item => item.id === id);
    currentSelectedSize = p.sizes[0]; // Ustaw pierwszy dostępny rozmiar jako wybrany

    document.getElementById('modal-title').innerText = p.title;
    document.getElementById('modal-price').innerText = p.price.toFixed(2) + ' PLN';
    document.getElementById('modal-main-img').src = p.mainImg;

    // Generuj 4 miniaturki (assets/products/podglad-X1.png itd.)
    let thumbsHTML = '';
    for(let i = 1; i <= 4; i++) {
        let src = `assets/products/podglad-${p.letter}${i}.png`;
        thumbsHTML += `<img src="${src}" class="thumb-img" onclick="changeMainImg(this, '${src}')" onerror="this.style.display='none'">`;
    }
    document.getElementById('modal-thumbnails').innerHTML = thumbsHTML;

    // Generuj przyciski rozmiarów
    document.getElementById('modal-sizes').innerHTML = p.sizes.map(s => `
        <button class="size-btn ${s === currentSelectedSize ? 'active-size' : ''}" onclick="selectSize(this, '${s}')">${s}</button>
    `).join('');

    // Akcja przycisku "Dodaj"
    document.getElementById('modal-buy-btn').onclick = () => {
        addToCart(id, currentSelectedSize);
        closeProductModal();
        toggleCart();
    };

    document.getElementById('product-modal').classList.add('active');
}

// --- POMOCNICZE FUNKCJE ---
function selectSize(btn, size) {
    currentSelectedSize = size;
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active-size'));
    btn.classList.add('active-size');
}

function closeProductModal() { document.getElementById('product-modal').classList.remove('active'); }

function changeMainImg(el, src) { 
    document.getElementById('modal-main-img').src = src; 
    document.querySelectorAll('.thumb-img').forEach(i => i.classList.remove('active-thumb'));
    el.classList.add('active-thumb');
}

function toggleCart() { document.getElementById('cart-sidebar').classList.toggle('open'); }

function addToCart(id, size) {
    const p = products.find(item => item.id === id);
    cart.push({ ...p, selectedSize: size });
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    countEl.innerText = cart.length;
    let total = 0;

    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="cart-item">
                <img src="${item.mainImg}">
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>${item.price.toFixed(2)} PLN | Rozmiar: ${item.selectedSize}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    }).join('') || '<p style="text-align:center; opacity:0.5;">Koszyk jest pusty</p>';

    totalEl.innerText = total.toFixed(2);
}

// Startuj stronę
renderProducts();