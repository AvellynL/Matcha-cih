const PRODUCTS_API_URL = '/api/products';

async function fetchProducts() {
    try {
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Add to cart function using cart-api.js addItem
async function addToCart(product) {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }
    try {
        // Prepare item object for cart API
        const item = {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        };
        // Use addItem from cart-api.js
        await addItem(item);
        // Only alert and redirect if not redirected to login.html by addItem
        if (!window.location.href.includes('login.html')) {
            alert('Item added to cart');
            window.location.href = 'cart.html';
        }
    } catch (error) {
        console.error('Failed to add item to cart:', error);
        alert('Failed to add item to cart');
    }
}

// Example: Attach event listeners to add to cart buttons
// Assuming buttons have class 'add-to-cart-btn' and data-product-id attribute
document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchProducts();
    products.forEach(product => {
        const btn = document.querySelector(`.add-to-cart-btn[data-product-id="${product._id}"]`);
        if (btn) {
            btn.addEventListener('click', () => addToCart(product));
        }
    });
});
