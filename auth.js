// User type switching functionality
const typeBtns = document.querySelectorAll('.type-btn');
const authContainer = document.querySelector('.auth-container');

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active type button
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update container class
        authContainer.classList.remove('seller-selected');
        if (btn.dataset.type === 'seller') {
            authContainer.classList.add('seller-selected');
        }
    });
});

// Tab switching functionality
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        const isSeller = authContainer.classList.contains('seller-selected');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding form
        authForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${isSeller ? 'seller' : 'customer'}-${tabName}-form`) {
                form.classList.add('active');
            }
        });
    });
});

// Handle Customer Login
function handleCustomerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const rememberMe = document.getElementById('remember-me').checked;

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Store login status if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        // Redirect to account page
        window.location.href = 'account.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle Customer Registration
function handleCustomerRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const address = document.getElementById('register-address').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        alert('Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        orders: [],
        createdAt: new Date().toISOString()
    };

    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    sessionStorage.setItem('currentUser', JSON.stringify(newUser));

    // Redirect to account page
    window.location.href = 'account.html';
}

// Handle Seller Login
function handleSellerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('seller-login-email').value;
    const password = document.getElementById('seller-login-password').value;
    const rememberMe = document.getElementById('seller-remember-me').checked;

    // Get stored sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
    const seller = sellers.find(s => s.email === email && s.password === password);

    if (seller) {
        // Store login status if remember me is checked
        if (rememberMe) {
            localStorage.setItem('currentSeller', JSON.stringify(seller));
        } else {
            sessionStorage.setItem('currentSeller', JSON.stringify(seller));
        }
        
        // Redirect to seller dashboard
        window.location.href = 'seller-dashboard.html';
    } else {
        alert('Invalid email or password');
    }
}

// Handle Seller Registration
function handleSellerRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('seller-register-name').value;
    const email = document.getElementById('seller-register-email').value;
    const phone = document.getElementById('seller-register-phone').value;
    const address = document.getElementById('seller-register-address').value;
    const password = document.getElementById('seller-register-password').value;
    const confirmPassword = document.getElementById('seller-register-confirm-password').value;

    // Validate password match
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Get stored sellers
    const sellers = JSON.parse(localStorage.getItem('sellers')) || [];

    // Check if seller already exists
    if (sellers.some(seller => seller.email === email)) {
        alert('Email already registered');
        return;
    }

    // Create new seller
    const newSeller = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        createdAt: new Date().toISOString()
    };

    // Add seller to storage
    sellers.push(newSeller);
    localStorage.setItem('sellers', JSON.stringify(sellers));

    // Auto login after registration
    sessionStorage.setItem('currentSeller', JSON.stringify(newSeller));

    // Redirect to seller dashboard
    window.location.href = 'seller-dashboard.html';
}

// Check if user is already logged in
function checkAuthStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || 
                       JSON.parse(sessionStorage.getItem('currentUser'));
    const currentSeller = JSON.parse(localStorage.getItem('currentSeller')) || 
                         JSON.parse(sessionStorage.getItem('currentSeller'));
    
    if (currentUser) {
        window.location.href = 'account.html';
    } else if (currentSeller) {
        window.location.href = 'seller-dashboard.html';
    }
}

// Run on page load
checkAuthStatus(); 