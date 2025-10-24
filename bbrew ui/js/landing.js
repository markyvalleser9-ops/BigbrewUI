document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Check if button exists
    if (!startBtn) {
        console.error('Start button not found!');
        return;
    }
    
    // Add ripple effect on button click
    startBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
        
        // Show loading overlay
        loadingOverlay.classList.add('active');
        
        // Simulate loading and then redirect
        setTimeout(() => {
            console.log('Redirecting to index.html...');
            
            // Try different redirect methods
            try {
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Redirect failed:', error);
                // Fallback method
                window.location.assign('index.html');
            }
        }, 1500); // Increased loading time for better UX
    });
    
    // Add parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const coffeeElements = document.querySelectorAll('.floating-coffee');
        coffeeElements.forEach((coffee, index) => {
            const speed = (index + 1) * 10;
            coffee.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .start-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 107, 0, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add entrance animation to elements
    const elements = document.querySelectorAll('.logo-placeholder, .brand-name, .tagline, .start-btn');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});