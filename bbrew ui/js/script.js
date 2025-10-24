document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const welcomeModal = document.getElementById('welcomeModal');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalMessage = document.querySelector('.modal-message');

    // Initialize default accounts if they don't exist
    initializeDefaultAccounts();

    // Add input animations
    usernameInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    usernameInput.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });

    passwordInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });

    passwordInput.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Reset error message
        errorMessage.style.display = 'none';
        
        // Get cashier accounts from localStorage
        const cashierAccounts = JSON.parse(localStorage.getItem('bigbrewCashierAccounts')) || [];
        
        // Check if credentials match any cashier account
        const validAccount = cashierAccounts.find(account => 
            account.username === username && account.password === password
        );
        
        // Check for default admin credentials
        const isAdmin = username === 'admin123' && password === 'adminpass';
        
        // Check for default cashier credentials
        const isDefaultCashier = username === 'cashier123' && password === 'cashierpass';
        
        if (validAccount || isAdmin || isDefaultCashier) {
            // Determine user role and redirect page
            let role, redirectPage, displayName;
            
            if (isAdmin) {
                role = 'admin';
                redirectPage = 'adminhomepage.html';
                displayName = 'Admin';
            } else if (isDefaultCashier) {
                role = 'cashier';
                redirectPage = 'homepage.html';
                displayName = 'Cashier';
            } else {
                role = 'cashier';
                redirectPage = 'homepage.html';
                displayName = validAccount.name;
            }
            
            // Store current user information
            const currentUser = {
                name: displayName,
                username: username,
                role: role
            };
            
            localStorage.setItem('bigbrewCurrentUser', JSON.stringify(currentUser));
            
            // Update welcome message
            modalMessage.textContent = `Welcome to BIGBREW, ${displayName}!`;
            
            // Show welcome modal
            showModal();
            
            // Store redirect page for modal OK button
            modalOkBtn.setAttribute('data-redirect', redirectPage);
        } else {
            // Show error message with animation
            errorMessage.style.display = 'block';
            errorMessage.style.animation = 'shake 0.5s ease';
            
            // Add shake animation to inputs
            usernameInput.style.animation = 'shake 0.5s ease';
            passwordInput.style.animation = 'shake 0.5s ease';
            
            setTimeout(() => {
                errorMessage.style.animation = '';
                usernameInput.style.animation = '';
                passwordInput.style.animation = '';
                
                // Hide error message after 3 seconds
                setTimeout(() => {
                    errorMessage.style.display = 'none';
                }, 2500);
            }, 500);
        }
    });

    // Modal functions
    function showModal() {
        welcomeModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    function hideModal() {
        welcomeModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close modal when OK button is clicked and redirect to appropriate page
    modalOkBtn.addEventListener('click', function() {
        hideModal();
        // Get redirect page from button attribute
        const redirectPage = this.getAttribute('data-redirect');
        window.location.href = redirectPage;
    });

    // Close modal when clicking outside the modal content
    welcomeModal.addEventListener('click', function(e) {
        if (e.target === welcomeModal) {
            hideModal();
        }
    });

    // Function to initialize default accounts
    function initializeDefaultAccounts() {
        // Check if default accounts already exist
        const cashierAccounts = JSON.parse(localStorage.getItem('bigbrewCashierAccounts')) || [];
        
        // Check if default admin account exists
        const adminExists = cashierAccounts.some(account => 
            account.username === 'admin123'
        );
        
        // Check if default cashier account exists
        const cashierExists = cashierAccounts.some(account => 
            account.username === 'cashier123'
        );
        
        // Add default admin account if it doesn't exist
        if (!adminExists) {
            const adminAccount = {
                name: 'Admin',
                age: 30,
                gender: 'Other',
                username: 'admin123',
                password: 'adminpass',
                role: 'admin'
            };
            cashierAccounts.push(adminAccount);
        }
        
        // Add default cashier account if it doesn't exist
        if (!cashierExists) {
            const cashierAccount = {
                name: 'Default Cashier',
                age: 25,
                gender: 'Other',
                username: 'cashier123',
                password: 'cashierpass',
                role: 'cashier'
            };
            cashierAccounts.push(cashierAccount);
        }
        
        // Save updated accounts to localStorage
        localStorage.setItem('bigbrewCashierAccounts', JSON.stringify(cashierAccounts));
    }

    // Add CSS animations dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0.3; }
        }
        
        .form-group.focused .input-icon {
            color: #6d3209;
        }
    `;
    document.head.appendChild(style);
});