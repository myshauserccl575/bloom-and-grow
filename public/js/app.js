        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true
        });

        // Hamburger Menu
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav__links');
        const navButtons = document.querySelector('.nav__buttons');

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            navButtons.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                navButtons.classList.remove('active');
            });
        });

        // Authentication
        function logout() {
            // Add your logout logic here
            document.getElementById('logout-button').style.display = 'none';
            document.getElementById('authButtons').innerHTML = `
                <a href="login.html" class="nav__btn login">Login</a>
                <a href="signup.html" class="nav__btn signup">Sign Up</a>
            `;
        }


        
// Product Filtering
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter__btn');
    const products = document.querySelectorAll('.product__card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            products.forEach(product => {
                const category = product.getAttribute('data-category');
                
                if (filterValue === 'all' || filterValue === category) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
});

// Add to Cart functionality
document.querySelectorAll('.product__btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const product = button.closest('.product__card');
        const productName = product.querySelector('.product__title').textContent;
        const productPrice = product.querySelector('.product__price').textContent;
        
        // Add to cart logic here
        alert(`Added to cart: ${productName} - ${productPrice}`);
        // You can replace this with your actual cart functionality
    });
});

// Newsletter Subscription
document.querySelector('.newsletter__form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('.newsletter__input').value;
    // Add your newsletter subscription logic here
    alert(`Thank you for subscribing with: ${email}`);
    e.target.reset();
});

// Smooth scroll for footer links
document.querySelectorAll('.footer__link').forEach(link => {
    if (link.getAttribute('href').startsWith('#')) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
});