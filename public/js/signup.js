// frontend/public/js/signup.js
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('Registration successful, redirecting...');
            window.location.href = data.redirectUrl || '/';
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
});
const passwordInput = document.getElementById('password');
        const strengthIndicator = document.querySelector('.password-strength');

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            if (password.length === 0) {
                strengthIndicator.className = 'password-strength';
            } else if (password.length < 6) {
                strengthIndicator.className = 'password-strength weak';
            } else if (password.length < 10) {
                strengthIndicator.className = 'password-strength medium';
            } else {
                strengthIndicator.className = 'password-strength strong';
            }
        });

        document.getElementById('signupForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const button = this.querySelector('button');
            button.classList.add('loading');
            setTimeout(() => button.classList.remove('loading'), 2000);
        });

        // Add this to your app.js file
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorOutline = document.createElement('div');
cursorOutline.className = 'custom-cursor-outline';
document.body.appendChild(cursorOutline);

document.addEventListener('mousemove', (e) => {
    // Update cursor position
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Update outline position with smooth animation
    cursorOutline.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
    }, {
        duration: 500,
        fill: "forwards"
    });
});

// Add hover effect for interactive elements
const interactiveElements = document.querySelectorAll('a, button, .nav__link, .cast__card, .gallery__grid img, .connect__socials a, .nav__btn');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
        cursorOutline.classList.add('cursor-hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
        cursorOutline.classList.remove('cursor-hover');
    });
});

// Add click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-clicking');
    cursorOutline.classList.add('cursor-outline-clicking');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-clicking');
    cursorOutline.classList.remove('cursor-outline-clicking');
});

// Hide cursor when leaving the window
document.addEventListener('mouseout', () => {
    cursor.style.display = 'none';
    cursorOutline.style.display = 'none';
});

document.addEventListener('mouseover', () => {
    cursor.style.display = 'block';
    cursorOutline.style.display = 'block';
});


