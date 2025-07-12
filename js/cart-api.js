
const API_URL = '/api/cart';

async function getToken() {
  // Retrieve token from localStorage or other storage
  return localStorage.getItem('token');
}

async function getCart() {
  const token = await getToken();
  const res = await fetch(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (res.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  if (!res.ok) throw new Error('Failed to fetch cart');
  return await res.json();
}

async function saveCart(cart) {
  // Not needed as cart is saved via API calls
}

async function addItem(item) {
  const token = await getToken();
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });
  if (res.status === 401) {
    window.location.href = 'login.html';
    return;
  }
  if (!res.ok) throw new Error('Failed to add item to cart');
  return await res.json();
}

async function removeItem(itemId) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Failed to remove item from cart');
  return await res.json();
}

async function updateQuantity(itemId, quantity) {
  const token = await getToken();
  const res = await fetch(`${API_URL}/${itemId}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ quantity })
  });
  if (!res.ok) throw new Error('Failed to update item quantity');
  return await res.json();
}

function formatCurrency(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

async function renderCart(tableBodySelector, totalSelector) {
  try {
    const cart = await getCart();
    const tbody = document.querySelector(tableBodySelector);
    const totalEl = document.querySelector(totalSelector);
    tbody.innerHTML = '';

    let total = 0;

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
      inputQuantity.addEventListener('change', async (e) => {
        const newQty = parseInt(e.target.value);
        if (isNaN(newQty) || newQty < 1) {
          e.target.value = item.quantity;
          return;
        }
        await updateQuantity(item._id, newQty);
        await renderCart(tableBodySelector, totalSelector);
      });
      tdQuantity.appendChild(inputQuantity);
      tr.appendChild(tdQuantity);

      const tdTotalPrice = document.createElement('td');
      const itemTotal = item.price * item.quantity;
      tdTotalPrice.textContent = formatCurrency(itemTotal);
      tr.appendChild(tdTotalPrice);

      const tdRemove = document.createElement('td');
      const btnRemove = document.createElement('button');
      btnRemove.className = 'btn btn-outline-danger btn-sm';
      btnRemove.innerHTML = '<i class="fas fa-trash-alt"></i>';
      btnRemove.addEventListener('click', async () => {
        await removeItem(item._id);
        await renderCart(tableBodySelector, totalSelector);
      });
      tdRemove.appendChild(btnRemove);
      tr.appendChild(tdRemove);

      tbody.appendChild(tr);

      total += itemTotal;
    });

    totalEl.textContent = 'Total: ' + formatCurrency(total);
  } catch (error) {
    console.error('Error rendering cart:', error);
  }
}

window.addItem = addItem;
window.renderCart = renderCart;
