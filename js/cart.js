const CART_KEY = 'shoppingCart';

function reloadHeader() {
    $('#header').load('header.html');
}

function getCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return [];
    }
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addItem(item) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        cart.push(item);
    }
    saveCart(cart);
}

function removeItem(itemId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== itemId);
    saveCart(cart);
}

function updateQuantity(itemId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
            removeItem(itemId);
        } else {
            saveCart(cart);
        }
    }
}

function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

function formatCurrency(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function renderCart(tableBodySelector, totalSelector) {
    const cart = getCart();
    const tbody = document.querySelector(tableBodySelector);
    const totalEl = document.querySelector(totalSelector);
    tbody.innerHTML = '';

    cart.forEach(item => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        const divFlex = document.createElement('div');
        divFlex.className = 'd-flex align-items-center';
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.style.width = '60px';
        img.style.borderRadius = '0.25rem';
        img.className = 'me-3';
        const span = document.createElement('span');
        span.textContent = item.name;
        divFlex.appendChild(img);
        divFlex.appendChild(span);
        tdName.appendChild(divFlex);
        tr.appendChild(tdName);

        const tdPrice = document.createElement('td');
        tdPrice.textContent = formatCurrency(item.price);
        tr.appendChild(tdPrice);

        const tdQuantity = document.createElement('td');
        const inputQuantity = document.createElement('input');
        inputQuantity.type = 'number';
        inputQuantity.min = '1';
        inputQuantity.value = item.quantity;
        inputQuantity.className = 'form-control';
        inputQuantity.style.width = '80px';
        inputQuantity.addEventListener('change', (e) => {
            const newQty = parseInt(e.target.value);
            if (isNaN(newQty) || newQty < 1) {
                e.target.value = item.quantity;
                return;
            }
            updateQuantity(item.id, newQty);
            renderCart(tableBodySelector, totalSelector);
        });
        tdQuantity.appendChild(inputQuantity);
        tr.appendChild(tdQuantity);

        const tdTotalPrice = document.createElement('td');
        tdTotalPrice.textContent = formatCurrency(item.price * item.quantity);
        tr.appendChild(tdTotalPrice);

        const tdRemove = document.createElement('td');
        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn btn-outline-danger btn-sm';
        btnRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';
        btnRemove.addEventListener('click', () => {
            removeItem(item.id);
            renderCart(tableBodySelector, totalSelector);
        });
        tdRemove.appendChild(btnRemove);
        tr.appendChild(tdRemove);

        tbody.appendChild(tr);
    });

    totalEl.textContent = 'Total: ' + formatCurrency(calculateTotal());
}
