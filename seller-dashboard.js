// Check if seller is logged in
function checkSellerAuth() {
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller')) || 
                         JSON.parse(sessionStorage.getItem('currentSeller'));
    
    if (!currentSeller) {
        window.location.href = 'seller.html';
    }
}

// Get all orders from all users
function getAllOrders() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let allOrders = [];
    
    users.forEach(user => {
        if (user.orders && user.orders.length > 0) {
            user.orders.forEach(order => {
                allOrders.push({
                    ...order,
                    customerName: user.name,
                    customerEmail: user.email
                });
            });
        }
    });
    
    return allOrders;
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    users.forEach(user => {
        if (user.orders) {
            user.orders.forEach(order => {
                if (order.id === orderId) {
                    order.status = newStatus;
                    order.lastUpdated = new Date().toISOString();
                }
            });
        }
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    displayOrders(currentFilter);
}

// Display orders in the table
function displayOrders(status = 'all') {
    const orders = getAllOrders();
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';
    
    const filteredOrders = status === 'all' 
        ? orders 
        : orders.filter(order => order.status === status);
    
    filteredOrders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customerName}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
                <select class="status-select" data-order-id="${order.id}">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="completed" ${order.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    // Add event listeners to status selects
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            updateOrderStatus(orderId, newStatus);
        });
    });
}

// Handle filter buttons
let currentFilter = 'all';
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update and display filtered orders
        currentFilter = btn.dataset.status;
        displayOrders(currentFilter);
    });
});

// Handle logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentSeller');
    sessionStorage.removeItem('currentSeller');
    window.location.href = 'seller.html';
});

// Initialize dashboard
checkSellerAuth();
displayOrders(); 