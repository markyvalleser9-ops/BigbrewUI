document.addEventListener('DOMContentLoaded', function() {
    // Initialize inventory data if not exists
    initializeInventoryData();
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const menuContents = document.querySelectorAll('.menu-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            tabBtns.forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            menuContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === category) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const pageContents = document.querySelectorAll('.page-content');
    const cartSection = document.getElementById('cartSection');
    const floatingCart = document.getElementById('floatingCart');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all content
            menuContents.forEach(content => content.classList.remove('active'));
            pageContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding page
            if (page === 'menu') {
                // Show the first menu category
                document.getElementById('milktea').classList.add('active');
                tabBtns[0].classList.add('active');
                
                // Expand cart for menu page
                cartSection.classList.remove('collapsed');
                cartSection.classList.add('expanded');
                floatingCart.classList.remove('visible');
            } else {
                const pageElement = document.getElementById(page);
                if (pageElement) {
                    pageElement.classList.add('active');
                    
                    // Collapse cart for other pages
                    cartSection.classList.remove('expanded');
                    cartSection.classList.add('collapsed');
                    floatingCart.classList.add('visible');
                    
                    // Load data for specific pages
                    if (page === 'order-history') {
                        loadOrderHistory();
                    } else if (page === 'addaccount') {
                        displayExistingAccounts();
                    } else if (page === 'inventory') {
                        loadInventory();
                    }
                }
            }
        });
    });
    
    // Cart functionality
    const cartItems = document.getElementById('cartItems');
    const totalPriceElement = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    const orderSummary = document.getElementById('orderSummary');
    const totalAmount = document.getElementById('totalAmount');
    const orderNumber = document.getElementById('orderNumber');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmBtn = document.getElementById('confirmBtn');
    const okBtn = document.getElementById('okBtn');
    const cartBadge = document.getElementById('cartBadge');
    
    // Payment elements
    const paymentAmount = document.getElementById('paymentAmount');
    const changeAmount = document.getElementById('changeAmount');
    const modalPaymentAmount = document.getElementById('modalPaymentAmount');
    const modalChangeAmount = document.getElementById('modalChangeAmount');
    
    // Logout modal elements
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const logoutYesBtn = document.getElementById('logoutYesBtn');
    const logoutNoBtn = document.getElementById('logoutNoBtn');
    
    // Order history elements
    const historyList = document.getElementById('historyList');
    const dateFilter = document.getElementById('dateFilter');
    const orderIdSearch = document.getElementById('orderIdSearch');
    const filterBtn = document.getElementById('filterBtn');
    const searchOrderIdBtn = document.getElementById('searchOrderIdBtn');
    const clearFilterBtn = document.getElementById('clearFilterBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    
    // Receipt modal elements
    const receiptModal = document.getElementById('receiptModal');
    const receiptContent = document.getElementById('receiptContent');
    const printReceiptBtn = document.getElementById('printReceiptBtn');
    const downloadReceiptBtn = document.getElementById('downloadReceiptBtn');
    const orderAgainBtn = document.getElementById('orderAgainBtn');
    
    // Edit inventory modal elements
    const editInventoryModal = document.getElementById('editInventoryModal');
    const editInventoryForm = document.getElementById('editInventoryForm');
    const editItemName = document.getElementById('editItemName');
    const editItemCategory = document.getElementById('editItemCategory');
    const editItemPrice = document.getElementById('editItemPrice');
    const editItemStock = document.getElementById('editItemStock');
    const editItemUnit = document.getElementById('editItemUnit');
    const editInventoryMessage = document.getElementById('editInventoryMessage');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const saveEditBtn = document.getElementById('saveEditBtn');
    
    // Suggest order button
    const suggestOrderBtn = document.getElementById('suggestOrderBtn');
    
    let cart = [];
    let orderHistory = JSON.parse(localStorage.getItem('bigbrewOrderHistory')) || [];
    let lastOrderNumber = parseInt(localStorage.getItem('bigbrewLastOrderNumber')) || 0;
    let currentEditingItem = null;
    
    // Initialize menu items from inventory
    loadMenuItems();
    
    // Floating cart click event
    floatingCart.addEventListener('click', function() {
        cartSection.classList.remove('collapsed');
        cartSection.classList.add('expanded');
        floatingCart.classList.remove('visible');
    });
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const menuItem = e.target.closest('.menu-item');
            const name = menuItem.getAttribute('data-name');
            const size = e.target.getAttribute('data-size');
            
            let price;
            if (size === 'hot') {
                price = parseInt(menuItem.getAttribute('data-price-hot') || 39);
            } else if (size === 'regular') {
                price = parseInt(menuItem.getAttribute('data-price') || 9);
            } else if (size === 'medio') {
                price = parseInt(menuItem.getAttribute('data-price-medio') || 29);
            } else if (size === 'grande') {
                price = parseInt(menuItem.getAttribute('data-price-grande') || 39);
            }
            
            // Check if item is in stock
            const inventory = getInventoryItem(name);
            if (inventory && inventory.stock <= 0) {
                alert(`${name} is out of stock!`);
                return;
            }
            
            // Check if item already exists in cart
            const existingItemIndex = cart.findIndex(item => 
                item.name === name && item.size === size
            );
            
            if (existingItemIndex !== -1) {
                // Increment quantity if item exists
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    name,
                    size,
                    price,
                    quantity: 1
                });
            }
            
            updateCart();
            
            // Visual feedback
            const originalText = e.target.textContent;
            e.target.textContent = 'Added!';
            e.target.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.style.backgroundColor = '';
            }, 1000);
        }
    });
    
    // Update cart display
    function updateCart() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            checkoutBtn.disabled = true;
            cartBadge.textContent = '0';
            paymentAmount.value = '';
            changeAmount.textContent = '₱0';
            paymentAmount.classList.remove('error', 'success');
        } else {
            cartItems.innerHTML = '';
            let total = 0;
            let itemCount = 0;
            
            cart.forEach((item, index) => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                const itemInfo = document.createElement('div');
                itemInfo.className = 'item-info';
                
                const itemName = document.createElement('div');
                itemName.className = 'item-name';
                itemName.textContent = item.name;
                
                const itemSize = document.createElement('div');
                itemSize.className = 'item-size';
                
                if (item.size === 'medio') {
                    itemSize.textContent = 'Medio';
                } else if (item.size === 'grande') {
                    itemSize.textContent = 'Grande';
                } else if (item.size === 'hot') {
                    itemSize.textContent = 'Hot';
                } else if (item.size === 'regular') {
                    itemSize.textContent = 'Add-on';
                } else {
                    itemSize.textContent = `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                }
                
                itemInfo.appendChild(itemName);
                itemInfo.appendChild(itemSize);
                
                const itemPrice = document.createElement('div');
                itemPrice.className = 'item-price';
                itemPrice.textContent = `₱${item.price}`;
                
                const itemQuantity = document.createElement('div');
                itemQuantity.className = 'item-quantity';
                
                const decreaseBtn = document.createElement('button');
                decreaseBtn.className = 'quantity-btn';
                decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
                decreaseBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        item.quantity--;
                        updateCart();
                    }
                });
                
                const quantityValue = document.createElement('div');
                quantityValue.className = 'quantity-value';
                quantityValue.textContent = item.quantity;
                
                const increaseBtn = document.createElement('button');
                increaseBtn.className = 'quantity-btn';
                increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
                increaseBtn.addEventListener('click', () => {
                    item.quantity++;
                    updateCart();
                });
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                removeBtn.addEventListener('click', () => {
                    cart.splice(index, 1);
                    updateCart();
                });
                
                itemQuantity.appendChild(decreaseBtn);
                itemQuantity.appendChild(quantityValue);
                itemQuantity.appendChild(increaseBtn);
                itemQuantity.appendChild(removeBtn);
                
                cartItem.appendChild(itemInfo);
                cartItem.appendChild(itemPrice);
                cartItem.appendChild(itemQuantity);
                
                cartItems.appendChild(cartItem);
                
                total += item.price * item.quantity;
                itemCount += item.quantity;
            });
            
            totalPriceElement.textContent = `₱${total}`;
            checkoutBtn.disabled = false;
            cartBadge.textContent = itemCount;
            
            // Update change calculation if payment amount is entered
            calculateChange();
        }
    }
    
    // Payment amount input handler
    paymentAmount.addEventListener('input', function() {
        calculateChange();
    });
    
    // Calculate change function
    function calculateChange() {
        const totalText = totalPriceElement.textContent;
        const total = parseInt(totalText.replace('₱', ''));
        const payment = parseInt(paymentAmount.value) || 0;
        
        if (payment > 0) {
            const change = payment - total;
            
            if (payment >= total) {
                changeAmount.textContent = `₱${change}`;
                changeAmount.style.color = 'var(--success-green)';
                paymentAmount.classList.remove('error');
                paymentAmount.classList.add('success');
                checkoutBtn.disabled = false;
            } else {
                changeAmount.textContent = `₱${Math.abs(change)} (Insufficient)`;
                changeAmount.style.color = 'var(--error-red)';
                paymentAmount.classList.remove('success');
                paymentAmount.classList.add('error');
                checkoutBtn.disabled = true;
            }
        } else {
            changeAmount.textContent = '₱0';
            changeAmount.style.color = 'var(--success-green)';
            paymentAmount.classList.remove('error', 'success');
            checkoutBtn.disabled = cart.length === 0;
        }
    }
    
    // Checkout functionality
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        const totalText = totalPriceElement.textContent;
        const total = parseInt(totalText.replace('₱', ''));
        const payment = parseInt(paymentAmount.value) || 0;
        
        // Validate payment amount
        if (payment < total) {
            paymentAmount.classList.add('error');
            paymentAmount.focus();
            return;
        }
        
        // Check if all items are in stock
        let outOfStockItems = [];
        cart.forEach(item => {
            const inventory = getInventoryItem(item.name);
            if (inventory && inventory.stock < item.quantity) {
                outOfStockItems.push(item.name);
            }
        });
        
        if (outOfStockItems.length > 0) {
            alert(`The following items are out of stock or have insufficient quantity: ${outOfStockItems.join(', ')}`);
            return;
        }
        
        // Generate order summary
        orderSummary.innerHTML = '';
        let orderTotal = 0;
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            
            const itemName = document.createElement('div');
            itemName.textContent = `${item.name} (${item.size === 'medio' ? 'Medio' : 
                item.size === 'grande' ? 'Grande' : 
                item.size === 'hot' ? 'Hot' : 
                item.size === 'regular' ? 'Add-on' : 
                `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`}) x${item.quantity}`;
            
            const itemPrice = document.createElement('div');
            itemPrice.textContent = `₱${item.price * item.quantity}`;
            
            orderItem.appendChild(itemName);
            orderItem.appendChild(itemPrice);
            orderSummary.appendChild(orderItem);
            
            orderTotal += item.price * item.quantity;
        });
        
        totalAmount.textContent = `₱${orderTotal}`;
        modalPaymentAmount.textContent = `₱${payment}`;
        modalChangeAmount.textContent = `₱${payment - orderTotal}`;
        
        // Generate sequential order number
        lastOrderNumber++;
        const formattedOrderNumber = lastOrderNumber.toString().padStart(2, '0');
        orderNumber.textContent = formattedOrderNumber;
        
        // Store order number for later use
        checkoutBtn.setAttribute('data-order-number', formattedOrderNumber);
        
        // Save last order number to localStorage
        localStorage.setItem('bigbrewLastOrderNumber', lastOrderNumber.toString());
        
        // Show checkout modal
        checkoutModal.classList.add('active');
    });
    
    // Cancel checkout
    cancelBtn.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
    });
    
    // Confirm checkout
    confirmBtn.addEventListener('click', function() {
        checkoutModal.classList.remove('active');
        
        // Update inventory stock
        cart.forEach(item => {
            updateInventoryStock(item.name, item.quantity);
        });
        
        // Save order to history
        const orderNumber = checkoutBtn.getAttribute('data-order-number');
        const orderDate = new Date();
        const orderTotal = totalAmount.textContent;
        const payment = parseInt(paymentAmount.value) || 0;
        const change = payment - parseInt(orderTotal.replace('₱', ''));
        
        const order = {
            orderNumber,
            date: orderDate.toISOString(),
            items: [...cart],
            total: orderTotal,
            payment: `₱${payment}`,
            change: `₱${change}`
        };
        
        orderHistory.push(order);
        localStorage.setItem('bigbrewOrderHistory', JSON.stringify(orderHistory));
        
        // Generate receipt content
        generateReceiptContent(orderNumber, orderDate, cart, orderTotal, payment, change);
        
        // Show receipt modal
        receiptModal.classList.add('active');
        
        // Clear cart and payment
        cart = [];
        updateCart();
        paymentAmount.value = '';
    });
    
    // Close success modal
    okBtn.addEventListener('click', function() {
        successModal.classList.remove('active');
    });
    
    // Logout functionality
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Show logout confirmation modal
        logoutModal.classList.add('active');
    });
    
    // Logout Yes button
    logoutYesBtn.addEventListener('click', function() {
        logoutModal.classList.remove('active');
        // Redirect to login page
        window.location.href = 'index.html';
    });
    
    // Logout No button
    logoutNoBtn.addEventListener('click', function() {
        logoutModal.classList.remove('active');
    });
    
    // Order history functionality
    function loadOrderHistory(filterDate = null, orderId = null) {
        let filteredOrders = [...orderHistory];
        
        // Sort orders by date (newest first)
        filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Apply date filter if provided
        if (filterDate) {
            const filterDateObj = new Date(filterDate);
            filteredOrders = filteredOrders.filter(order => {
                const orderDate = new Date(order.date);
                return orderDate.toDateString() === filterDateObj.toDateString();
            });
        }
        
        // Apply order ID filter if provided
        if (orderId) {
            filteredOrders = filteredOrders.filter(order => 
                order.orderNumber.toLowerCase().includes(orderId.toLowerCase())
            );
        }
        
        if (filteredOrders.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-receipt"></i>
                    <p>No orders found</p>
                </div>
            `;
            return;
        }
        
        historyList.innerHTML = '';
        
        filteredOrders.forEach(order => {
            const orderDate = new Date(order.date);
            const formattedDate = orderDate.toLocaleDateString();
            const formattedTime = orderDate.toLocaleTimeString();
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const historyHeader = document.createElement('div');
            historyHeader.className = 'history-header';
            
            const orderNumber = document.createElement('div');
            orderNumber.className = 'order-number';
            orderNumber.textContent = `Order #${order.orderNumber}`;
            
            const orderDateElement = document.createElement('div');
            orderDateElement.className = 'order-date';
            orderDateElement.textContent = `${formattedDate} ${formattedTime}`;
            
            historyHeader.appendChild(orderNumber);
            historyHeader.appendChild(orderDateElement);
            
            const orderItems = document.createElement('div');
            orderItems.className = 'order-items';
            
            order.items.forEach(item => {
                const itemTag = document.createElement('span');
                itemTag.className = 'order-item-tag';
                itemTag.textContent = `${item.name} (${item.size === 'medio' ? 'Medio' : 
                    item.size === 'grande' ? 'Grande' : 
                    item.size === 'hot' ? 'Hot' : 
                    item.size === 'regular' ? 'Add-on' : 
                    `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`}) x${item.quantity}`;
                orderItems.appendChild(itemTag);
            });
            
            const orderTotal = document.createElement('div');
            orderTotal.className = 'order-total';
            orderTotal.textContent = `Total: ${order.total}`;
            
            historyItem.appendChild(historyHeader);
            historyItem.appendChild(orderItems);
            historyItem.appendChild(orderTotal);
            
            historyList.appendChild(historyItem);
        });
    }
    
    // Filter functionality
    filterBtn.addEventListener('click', function() {
        const filterDate = dateFilter.value;
        loadOrderHistory(filterDate, null);
    });
    
    // Search by order ID
    searchOrderIdBtn.addEventListener('click', function() {
        const orderId = orderIdSearch.value.trim();
        const filterDate = dateFilter.value;
        loadOrderHistory(filterDate, orderId);
    });
    
    // Clear filter functionality
    clearFilterBtn.addEventListener('click', function() {
        dateFilter.value = '';
        orderIdSearch.value = '';
        loadOrderHistory();
    });
    
    // Download PDF functionality
    downloadPdfBtn.addEventListener('click', function() {
        generateOrderHistoryPDF();
    });
    
    // Print receipt functionality
    printReceiptBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Download receipt functionality
    downloadReceiptBtn.addEventListener('click', function() {
        generateReceiptPDF();
    });
    
    // Order again functionality
    orderAgainBtn.addEventListener('click', function() {
        receiptModal.classList.remove('active');
    });
    
    // Generate receipt content - Enhanced to look like McDonald's receipt
    function generateReceiptContent(orderNumber, orderDate, items, total, payment, change) {
        receiptContent.innerHTML = '';
        
        // Create receipt header
        const receiptHeader = document.createElement('div');
        receiptHeader.className = 'receipt-header';
        
        const receiptLogo = document.createElement('div');
        receiptLogo.className = 'receipt-logo';
        
        const logoImg = document.createElement('img');
        logoImg.src = 'logo.png';
        logoImg.alt = 'BIGBREW Logo';
        
        const receiptTitle = document.createElement('div');
        receiptTitle.className = 'receipt-title';
        receiptTitle.textContent = 'BIGBREW';
        
        const receiptSubtitle = document.createElement('div');
        receiptSubtitle.className = 'receipt-subtitle';
        receiptSubtitle.textContent = 'Your Favorite Milk Tea Shop';
        
        const receiptAddress = document.createElement('div');
        receiptAddress.className = 'receipt-address';
        receiptAddress.textContent = '123 Milk Tea Street, Tea City';
        
        receiptLogo.appendChild(logoImg);
        receiptLogo.appendChild(receiptTitle);
        receiptLogo.appendChild(receiptSubtitle);
        receiptLogo.appendChild(receiptAddress);
        
        const receiptDetails = document.createElement('div');
        receiptDetails.className = 'receipt-details';
        
        const receiptNumber = document.createElement('div');
        receiptNumber.className = 'receipt-number';
        receiptNumber.textContent = `Order #${orderNumber}`;
        
        const receiptDateElement = document.createElement('div');
        receiptDateElement.className = 'receipt-date';
        receiptDateElement.textContent = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
        
        receiptDetails.appendChild(receiptNumber);
        receiptDetails.appendChild(receiptDateElement);
        
        receiptHeader.appendChild(receiptLogo);
        receiptHeader.appendChild(receiptDetails);
        
        // Create receipt items
        const receiptItems = document.createElement('div');
        receiptItems.className = 'receipt-items';
        
        // Add items
        items.forEach(item => {
            const receiptItem = document.createElement('div');
            receiptItem.className = 'receipt-item';
            
            const receiptItemQty = document.createElement('div');
            receiptItemQty.className = 'receipt-item-qty';
            receiptItemQty.textContent = item.quantity;
            
            const receiptItemName = document.createElement('div');
            receiptItemName.className = 'receipt-item-name';
            
            const sizeText = item.size === 'medio' ? 'Medio' : 
                item.size === 'grande' ? 'Grande' : 
                item.size === 'hot' ? 'Hot' : 
                item.size === 'regular' ? 'Add-on' : 
                `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
            
            receiptItemName.innerHTML = `
                <div class="item-name">${item.name}</div>
                <div class="item-size">${sizeText}</div>
            `;
            
            const receiptItemPrice = document.createElement('div');
            receiptItemPrice.className = 'receipt-item-price';
            receiptItemPrice.textContent = `₱${item.price * item.quantity}`;
            
            receiptItem.appendChild(receiptItemQty);
            receiptItem.appendChild(receiptItemName);
            receiptItem.appendChild(receiptItemPrice);
            receiptItems.appendChild(receiptItem);
        });
        
        // Create receipt summary
        const receiptSummary = document.createElement('div');
        receiptSummary.className = 'receipt-summary';
        
        // Calculate subtotal
        let subtotal = 0;
        items.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        
        // Add tax (12% VAT)
        const tax = Math.round(subtotal * 0.12);
        
        // Create subtotal row
        const subtotalRow = document.createElement('div');
        subtotalRow.className = 'receipt-summary-row';
        const subtotalLabel = document.createElement('div');
        subtotalLabel.textContent = 'Subtotal';
        const subtotalValue = document.createElement('div');
        subtotalValue.textContent = `₱${subtotal}`;
        subtotalRow.appendChild(subtotalLabel);
        subtotalRow.appendChild(subtotalValue);
        
        // Create tax row
        const taxRow = document.createElement('div');
        taxRow.className = 'receipt-summary-row';
        const taxLabel = document.createElement('div');
        taxLabel.textContent = 'Tax (12%)';
        const taxValue = document.createElement('div');
        taxValue.textContent = `₱${tax}`;
        taxRow.appendChild(taxLabel);
        taxRow.appendChild(taxValue);
        
        // Create total row
        const totalRow = document.createElement('div');
        totalRow.className = 'receipt-summary-row total';
        const totalLabel = document.createElement('div');
        totalLabel.textContent = 'Total';
        const totalValue = document.createElement('div');
        totalValue.className = 'receipt-total-amount';
        totalValue.textContent = total;
        totalRow.appendChild(totalLabel);
        totalRow.appendChild(totalValue);
        
        // Create payment row
        const paymentRow = document.createElement('div');
        paymentRow.className = 'receipt-summary-row';
        const paymentLabel = document.createElement('div');
        paymentLabel.textContent = 'Cash';
        const paymentValue = document.createElement('div');
        paymentValue.textContent = `₱${payment}`;
        paymentRow.appendChild(paymentLabel);
        paymentRow.appendChild(paymentValue);
        
        // Create change row
        const changeRow = document.createElement('div');
        changeRow.className = 'receipt-summary-row';
        const changeLabel = document.createElement('div');
        changeLabel.textContent = 'Change';
        const changeValue = document.createElement('div');
        changeValue.textContent = `₱${change}`;
        changeRow.appendChild(changeLabel);
        changeRow.appendChild(changeValue);
        
        receiptSummary.appendChild(subtotalRow);
        receiptSummary.appendChild(taxRow);
        receiptSummary.appendChild(totalRow);
        receiptSummary.appendChild(paymentRow);
        receiptSummary.appendChild(changeRow);
        
        // Create receipt footer
        const receiptFooter = document.createElement('div');
        receiptFooter.className = 'receipt-footer';
        
        const thankYou = document.createElement('div');
        thankYou.className = 'receipt-thank-you';
        thankYou.textContent = 'Thank you for your purchase!';
        
        const visitAgain = document.createElement('div');
        visitAgain.className = 'receipt-visit-again';
        visitAgain.textContent = 'Please visit us again';
        
        const contact = document.createElement('div');
        contact.className = 'receipt-contact';
        contact.textContent = 'Follow us @bigbrewph';
        
        receiptFooter.appendChild(thankYou);
        receiptFooter.appendChild(visitAgain);
        receiptFooter.appendChild(contact);
        
        // Add all elements to receipt content
        receiptContent.appendChild(receiptHeader);
        receiptContent.appendChild(receiptItems);
        receiptContent.appendChild(receiptSummary);
        receiptContent.appendChild(receiptFooter);
        
        // Add tear line at the bottom
        const tearLine = document.createElement('div');
        tearLine.className = 'receipt-tear-line';
        receiptContent.appendChild(tearLine);
    }
    
    function generateReceiptPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Get order details from the receipt content
        const orderNumber = document.querySelector('#receiptContent .receipt-number').textContent;
        const orderDate = document.querySelector('#receiptContent .receipt-date').textContent;
        
        // Set font to monospace for receipt look
        doc.setFont('courier');
        
        // Add title
        doc.setFontSize(18);
        doc.text('BIGBREW', 105, 15, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(10);
        doc.text('Your Favorite Milk Tea Shop', 105, 22, { align: 'center' });
        doc.text('123 Milk Tea Street, Tea City', 105, 28, { align: 'center' });
        
        // Add order number and date
        doc.setFontSize(12);
        doc.text(orderNumber, 20, 40);
        doc.text(orderDate, 20, 46);
        
        // Add line separator
        doc.setLineWidth(0.2);
        doc.line(15, 52, 195, 52);
        
        // Add table headers
        doc.setFontSize(10);
        doc.text('QTY', 20, 60);
        doc.text('ITEM', 40, 60);
        doc.text('PRICE', 170, 60, { align: 'right' });
        
        // Add line separator
        doc.setLineWidth(0.1);
        doc.line(15, 63, 195, 63);
        
        // Add items
        let yPosition = 70;
        const receiptItems = document.querySelectorAll('#receiptContent .receipt-item');
        
        receiptItems.forEach(item => {
            const qty = item.querySelector('.receipt-item-qty').textContent;
            const name = item.querySelector('.item-name').textContent;
            const size = item.querySelector('.item-size').textContent;
            const price = item.querySelector('.receipt-item-price').textContent;
            
            doc.setFontSize(10);
            // Fix encoding issue by using text with proper encoding
            doc.text(qty, 20, yPosition);
            doc.text(`${name} (${size})`, 40, yPosition);
            doc.text(price, 170, yPosition, { align: 'right' });
            yPosition += 8;
        });
        
        // Add line separator
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        yPosition += 8;
        
        // Add summary
        const summaryRows = document.querySelectorAll('#receiptContent .receipt-summary-row');
        summaryRows.forEach(row => {
            const label = row.querySelector('div:first-child').textContent;
            const value = row.querySelector('div:last-child').textContent;
            
            if (row.classList.contains('total')) {
                doc.setFontSize(12);
                doc.setFont('courier', 'bold');
            } else {
                doc.setFontSize(10);
                doc.setFont('courier', 'normal');
            }
            
            // Fix encoding issue by using text with proper encoding
            doc.text(label, 25, yPosition);
            doc.text(value, 170, yPosition, { align: 'right' });
            yPosition += 8;
        });
        
        // Add line separator
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        yPosition += 10;
        
        // Add footer
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        doc.text('Thank you for your purchase!', 105, yPosition, { align: 'center' });
        yPosition += 6;
        doc.text('Please visit us again', 105, yPosition, { align: 'center' });
        yPosition += 6;
        doc.text('Follow us @bigbrewph', 105, yPosition, { align: 'center' });
        
        // Save the PDF
        doc.save(`BIGBREW_Receipt_${orderNumber.replace('Order #', '')}.pdf`);
    }
    
    function generateOrderHistoryPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('BIGBREW Order History', 105, 15, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(10);
        doc.text('Your Favorite Milk Tea Shop', 105, 22, { align: 'center' });
        doc.text('123 Milk Tea Street, Tea City', 105, 28, { align: 'center' });
        
        // Add generation date
        const today = new Date();
        doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, 105, 35, { align: 'center' });
        
        // Add line separator
        doc.setLineWidth(0.2);
        doc.line(15, 40, 195, 40);
        
        // Add table headers
        doc.setFontSize(10);
        doc.text('Order #', 20, 50);
        doc.text('Date', 60, 50);
        doc.text('Items', 100, 50);
        doc.text('Total', 170, 50, { align: 'right' });
        
        // Add line separator
        doc.setLineWidth(0.1);
        doc.line(15, 53, 195, 53);
        
        // Add orders
        let yPosition = 60;
        
        if (orderHistory.length === 0) {
            doc.text('No order history available', 105, yPosition, { align: 'center' });
        } else {
            // Sort orders by date (newest first)
            const sortedOrders = [...orderHistory].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );
            
            sortedOrders.forEach(order => {
                const orderDate = new Date(order.date);
                const formattedDate = orderDate.toLocaleDateString();
                const formattedTime = orderDate.toLocaleTimeString();
                
                // Check if we need a new page
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                    
                    // Add headers on new page
                    doc.setFontSize(10);
                    doc.text('Order #', 20, yPosition);
                    doc.text('Date', 60, yPosition);
                    doc.text('Items', 100, yPosition);
                    doc.text('Total', 170, yPosition, { align: 'right' });
                    
                    // Add line separator
                    doc.setLineWidth(0.1);
                    doc.line(15, yPosition + 3, 195, yPosition + 3);
                    yPosition += 10;
                }
                
                // Add order number
                doc.setFontSize(10);
                doc.text(`#${order.orderNumber}`, 20, yPosition);
                
                // Add date
                doc.text(`${formattedDate} ${formattedTime}`, 60, yPosition);
                
                // Add items with proper text wrapping
                let itemsText = '';
                order.items.forEach((item, index) => {
                    const sizeText = item.size === 'medio' ? 'Medio' : 
                        item.size === 'grande' ? 'Grande' : 
                        item.size === 'hot' ? 'Hot' : 
                        item.size === 'regular' ? 'Add-on' : 
                        `Iced ${item.size.charAt(0).toUpperCase() + item.size.slice(1)}`;
                    
                    if (index === 0) {
                        itemsText = `${item.name} (${sizeText}) x${item.quantity}`;
                    } else if (index < 3) {
                        itemsText += `, ${item.name} (${sizeText}) x${item.quantity}`;
                    } else if (index === 3) {
                        itemsText += `...`;
                    }
                });
                
                // Function to wrap text
                const wrapText = (text, x, y, maxWidth, lineHeight) => {
                    const words = text.split(' ');
                    let line = '';
                    let currentY = y;
                    
                    for (let i = 0; i < words.length; i++) {
                        const testLine = line + words[i] + ' ';
                        const metrics = doc.getTextWidth(testLine);
                        const testWidth = metrics;
                        
                        if (testWidth > maxWidth && i > 0) {
                            doc.text(line, x, currentY);
                            line = words[i] + ' ';
                            currentY += lineHeight;
                        } else {
                            line = testLine;
                        }
                    }
                    doc.text(line, x, currentY);
                    return currentY + lineHeight;
                };
                
                // Add wrapped items text
                const itemsYPosition = wrapText(itemsText, 100, yPosition, 60, 4);
                
                // Adjust yPosition if items text wrapped to multiple lines
                const itemsHeight = itemsYPosition - yPosition;
                if (itemsHeight > 4) {
                    yPosition = itemsYPosition - 4;
                }
                
                // Add total
                doc.text(order.total, 170, yPosition, { align: 'right' });
                
                yPosition += 8;
            });
        }
        
        // Add line separator at the bottom
        doc.setLineWidth(0.2);
        doc.line(15, yPosition, 195, yPosition);
        
        // Add footer
        yPosition += 10;
        doc.setFontSize(10);
        doc.text('Thank you for your business!', 105, yPosition, { align: 'center' });
        yPosition += 6;
        doc.text('Follow us @bigbrewph', 105, yPosition, { align: 'center' });
        
        // Save the PDF
        doc.save('BIGBREW_Order_History.pdf');
    }
    
    // Close modals when clicking outside
    checkoutModal.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('active');
        }
    });
    
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });
    
    logoutModal.addEventListener('click', function(e) {
        if (e.target === logoutModal) {
            logoutModal.classList.remove('active');
        }
    });
    
    receiptModal.addEventListener('click', function(e) {
        if (e.target === receiptModal) {
            receiptModal.classList.remove('active');
        }
    });
    
    editInventoryModal.addEventListener('click', function(e) {
        if (e.target === editInventoryModal) {
            editInventoryModal.classList.remove('active');
        }
    });
    
    // ========================= INVENTORY MANAGEMENT =========================
    
    // Initialize inventory data
    function initializeInventoryData() {
        if (!localStorage.getItem('bigbrewInventory')) {
            const defaultInventory = [
                // Milk Tea Powders
                { id: 1, name: 'Dark Choco', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 2, name: 'Cookies & Cream', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 3, name: 'Okinawa', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 4, name: 'Wintermelon', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 5, name: 'Cheesecake', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 6, name: 'Matcha', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 7, name: 'Chocolate', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 8, name: 'Red Velvet', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 9, name: 'Salted Caramel', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 10, name: 'Choco Kisses', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 11, name: 'Taro', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 12, name: 'Strawberry', category: 'Milk Tea', price: 29, stock: 20, unit: 'pcs' },
                
                // Coffee Powders
                { id: 13, name: 'Brusko', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 14, name: 'Mocha', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 15, name: 'Macchiato', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 16, name: 'Vanilla', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 17, name: 'Caramel', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 18, name: 'Matcha', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 19, name: 'Fudge', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                { id: 20, name: 'Spanish Latte', category: 'Coffee', price: 29, stock: 20, unit: 'pcs' },
                
                // Fruit Tea Powders
                { id: 21, name: 'Lychee', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 22, name: 'Green Apple', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 23, name: 'Blueberry', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 24, name: 'Lemon', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 25, name: 'Strawberry', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 26, name: 'Kiwi', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 27, name: 'Mango', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                { id: 28, name: 'Honey Peach', category: 'Fruit Tea', price: 29, stock: 20, unit: 'pcs' },
                
                // Supplies
                { id: 29, name: 'Pearl', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 30, name: 'Crystal', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 31, name: 'Cream Cheese', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 32, name: 'Cream Puff', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 33, name: 'Crushed Oreo', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 34, name: 'Coffee Jelly', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 35, name: 'Whipped Cream', category: 'Toppings', price: 9, stock: 20, unit: 'pcs' },
                { id: 36, name: 'Cup Medio', category: 'Supplies', price: 0, stock: 20, unit: 'pcs' },
                { id: 37, name: 'Cup Grande', category: 'Supplies', price: 0, stock: 20, unit: 'pcs' },
                { id: 38, name: 'Straw', category: 'Supplies', price: 0, stock: 20, unit: 'pcs' }
            ];
            
            localStorage.setItem('bigbrewInventory', JSON.stringify(defaultInventory));
        }
    }
    
    // Load inventory items
    function loadInventory() {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        const powdersGrid = document.getElementById('powders-grid');
        const suppliesGrid = document.getElementById('supplies-grid');
        
        powdersGrid.innerHTML = '';
        suppliesGrid.innerHTML = '';
        
        inventory.forEach(item => {
            const inventoryItem = createInventoryItemElement(item);
            
            if (item.category === 'Supplies' || item.category === 'Toppings') {
                suppliesGrid.appendChild(inventoryItem);
            } else {
                powdersGrid.appendChild(inventoryItem);
            }
        });
    }
    
    // Create inventory item element
    function createInventoryItemElement(item) {
        const div = document.createElement('div');
        div.className = 'inventory-item';
        if (item.stock <= 5) {
            div.classList.add('low-stock');
        }
        
        div.innerHTML = `
            <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-category">${item.category}</span>
            </div>
            <div class="item-stock">
                <span class="stock-count ${item.stock <= 5 ? 'low-stock' : ''}">${item.stock}</span>
                <span class="stock-unit">${item.unit}</span>
            </div>
            <button class="edit-btn" data-id="${item.id}">
                <i class="fas fa-edit"></i>
            </button>
        `;
        
        // Add click event to edit button
        const editBtn = div.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => openEditModal(item));
        
        return div;
    }
    
    // Open edit modal
    function openEditModal(item) {
        currentEditingItem = item;
        editItemName.value = item.name;
        editItemCategory.value = item.category;
        editItemPrice.value = item.price;
        editItemStock.value = item.stock;
        editItemUnit.value = item.unit;
        
        editInventoryMessage.className = 'message';
        editInventoryModal.classList.add('active');
    }
    
    // Save inventory changes
    saveEditBtn.addEventListener('click', function() {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        const itemIndex = inventory.findIndex(item => item.id === currentEditingItem.id);
        
        if (itemIndex !== -1) {
            inventory[itemIndex] = {
                ...inventory[itemIndex],
                name: editItemName.value,
                price: parseInt(editItemPrice.value),
                stock: parseInt(editItemStock.value),
                unit: editItemUnit.value
            };
            
            localStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
            
            editInventoryMessage.textContent = 'Item updated successfully!';
            editInventoryMessage.className = 'message success';
            
            setTimeout(() => {
                editInventoryModal.classList.remove('active');
                loadInventory();
                loadMenuItems();
            }, 1500);
        }
    });
    
    // Cancel edit
    cancelEditBtn.addEventListener('click', function() {
        editInventoryModal.classList.remove('active');
    });
    
    // Get inventory item by name
    function getInventoryItem(name) {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        return inventory.find(item => item.name === name);
    }
    
    // Update inventory stock
    function updateInventoryStock(name, quantity) {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        const itemIndex = inventory.findIndex(item => item.name === name);
        
        if (itemIndex !== -1) {
            inventory[itemIndex].stock -= quantity;
            localStorage.setItem('bigbrewInventory', JSON.stringify(inventory));
        }
    }
    
    // Load menu items from inventory
    function loadMenuItems() {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        
        // Define menu categories
        const menuCategories = {
            milktea: ['Milk Tea'],
            coffee: ['Coffee'],
            'fruit-tea': ['Fruit Tea'],
            brosty: ['Fruit Tea'],
            praf: ['Milk Tea', 'Coffee', 'Fruit Tea'],
            'add-ons': ['Toppings']
        };
        
        // Populate menu items for each category
        Object.keys(menuCategories).forEach(category => {
            const container = document.getElementById(`${category}-items`);
            if (container) {
                container.innerHTML = '';
                
                const categoryItems = inventory.filter(item => 
                    menuCategories[category].includes(item.category)
                );
                
                categoryItems.forEach(item => {
                    const menuItem = createMenuItemElement(item, category);
                    container.appendChild(menuItem);
                });
            }
        });
    }
    
    // Create menu item element
    function createMenuItemElement(item, category) {
        const div = document.createElement('div');
        div.className = 'menu-item';
        div.setAttribute('data-name', item.name);
        div.setAttribute('data-price-medio', item.price);
        div.setAttribute('data-price-grande', item.price + 10);
        
        if (category === 'coffee') {
            div.setAttribute('data-price-hot', item.price + 10);
        }
        
        const isOutOfStock = item.stock <= 0;
        
        const emoji = {
            milktea: '🥤',
            coffee: '☕',
            'fruit-tea': '🍓',
            brosty: '❄️',
            praf: '🍧',
            'add-ons': '➕'
        };
        
        div.innerHTML = `
            <div class="item-info">
                <span class="item-emoji">${emoji[category]}</span>
                <span class="item-name">${item.name}</span>
            </div>
            <div class="item-actions">
                ${category === 'add-ons' ? 
                    `<button class="add-to-cart" data-size="regular" ${isOutOfStock ? 'disabled' : ''}>Add</button>` :
                    category === 'coffee' ?
                    `<button class="add-to-cart" data-size="medio" ${isOutOfStock ? 'disabled' : ''}>Iced Medio</button>
                     <button class="add-to-cart" data-size="grande" ${isOutOfStock ? 'disabled' : ''}>Iced Grande</button>
                     <button class="add-to-cart" data-size="hot" ${isOutOfStock ? 'disabled' : ''}>Hot</button>` :
                    `<button class="add-to-cart" data-size="medio" ${isOutOfStock ? 'disabled' : ''}>Medio</button>
                     <button class="add-to-cart" data-size="grande" ${isOutOfStock ? 'disabled' : ''}>Grande</button>`
                }
            </div>
        `;
        
        return div;
    }
    
    // Suggest stocks order - FIXED VERSION
    suggestOrderBtn.addEventListener('click', function() {
        const inventory = JSON.parse(localStorage.getItem('bigbrewInventory')) || [];
        const lowStockItems = inventory.filter(item => item.stock < 5);
        
        if (lowStockItems.length === 0) {
            alert('All items have sufficient stock (5 or more units)!');
            return;
        }
        
        // Generate and download PDF
        generateStockOrderPDF(lowStockItems);
    });
    
    // Generate stock order PDF - FIXED VERSION
    function generateStockOrderPDF(lowStockItems) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(18);
        doc.text('BIGBREW - Stock Order Suggestion', 105, 15, { align: 'center' });
        
        // Add subtitle
        doc.setFontSize(10);
        doc.text('Items with low stock (less than 5 units)', 105, 22, { align: 'center' });
        doc.text('Generated on: ' + new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(), 105, 28, { align: 'center' });
        
        // Add line separator
        doc.setLineWidth(0.2);
        doc.line(15, 35, 195, 35);
        
        // Add table headers
        doc.setFontSize(10);
        doc.text('Item Name', 20, 50);
        doc.text('Category', 80, 50);
        doc.text('Current Stock', 130, 50);
        doc.text('Suggested Order', 170, 50);
        
        // Add line separator
        doc.setLineWidth(0.1);
        doc.line(15, 53, 195, 53);
        
        // Add items
        let yPosition = 60;
        lowStockItems.forEach(item => {
            const suggestedOrder = Math.max(20 - item.stock, 10);
            
            doc.setFontSize(10);
            doc.text(item.name, 20, yPosition);
            doc.text(item.category, 80, yPosition);
            doc.text(`${item.stock} ${item.unit}`, 130, yPosition);
            doc.text(`${suggestedOrder} ${item.unit}`, 170, yPosition);
            
            yPosition += 8;
        });
        
        // Add line separator at the bottom
        doc.setLineWidth(0.2);
        doc.line(15, yPosition + 5, 195, yPosition + 5);
        
        // Add footer
        yPosition += 15;
        doc.setFontSize(10);
        doc.text('Please restock these items soon to avoid running out of stock.', 105, yPosition, { align: 'center' });
        yPosition += 8;
        doc.text('Total items needing restock: ' + lowStockItems.length, 105, yPosition, { align: 'center' });
        
        // Save and automatically download the PDF
        const fileName = `BIGBREW_Stock_Order_Suggestion_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        // Show success message
        setTimeout(() => {
            suggestOrderBtn.innerHTML = '<i class="fas fa-check"></i> PDF Downloaded!';
            suggestOrderBtn.style.backgroundColor = 'var(--success-green)';
            
            setTimeout(() => {
                suggestOrderBtn.innerHTML = '<i class="fas fa-clipboard-list"></i> Suggest Stocks Order';
                suggestOrderBtn.style.backgroundColor = '';
            }, 2000);
        }, 500);
    }
    
    // ========================= ADD ACCOUNT FUNCTIONALITY =========================
    
    // Add Cashier Account functionality
    const addAccountForm = document.getElementById('addAccountForm');
    const accountMessage = document.getElementById('accountMessage');
    const accountsList = document.getElementById('accountsList');

    // Function to display existing accounts
    function displayExistingAccounts() {
        const accounts = JSON.parse(localStorage.getItem('bigbrewCashierAccounts')) || [];
        accountsList.innerHTML = ''; // Clear the list first

        if (accounts.length === 0) {
            accountsList.innerHTML = '<p class="empty-state">No cashier accounts created yet.</p>';
            return;
        }

        accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.innerHTML = `
                <h4>${account.name}</h4>
                <p><strong>Username:</strong> <span class="username">${account.username}</span></p>
                <p><strong>Age:</strong> ${account.age}</p>
                <p><strong>Gender:</strong> ${account.gender}</p>
            `;
            accountsList.appendChild(accountCard);
        });
    }

    // Form submission handler
    addAccountForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent page reload

        // Get form values
        const name = document.getElementById('cashierName').value.trim();
        const age = document.getElementById('cashierAge').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const username = document.getElementById('cashierUsername').value.trim();
        const password = document.getElementById('cashierPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Clear previous messages
        accountMessage.className = 'message';
        accountMessage.textContent = '';

        // --- Validation ---
        if (password !== confirmPassword) {
            accountMessage.textContent = 'Passwords do not match!';
            accountMessage.className = 'message error';
            return;
        }

        // Get existing accounts from localStorage
        const accounts = JSON.parse(localStorage.getItem('bigbrewCashierAccounts')) || [];

        // Check if username already exists
        if (accounts.some(acc => acc.username === username)) {
            accountMessage.textContent = 'Username already exists. Please choose another one.';
            accountMessage.className = 'message error';
            return;
        }

        // Create new account object
        const newAccount = {
            name,
            age,
            gender,
            username,
            password // Note: In a real app, you should hash passwords!
        };

        // Add new account to the array
        accounts.push(newAccount);

        // Save updated accounts array to localStorage
        localStorage.setItem('bigbrewCashierAccounts', JSON.stringify(accounts));

        // Show success message
        accountMessage.textContent = `Account for ${name} created successfully!`;
        accountMessage.className = 'message success';

        // Reset the form
        addAccountForm.reset();

        // Refresh the list of accounts
        displayExistingAccounts();
    });
    
    // Initialize cart
    updateCart();
});