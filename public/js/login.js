<<<<<<< HEAD
const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('side-menu');
const closeBtn = document.getElementById('close-btn');

hamburger.addEventListener('click', () => {
    sideMenu.classList.toggle('show');
});

closeBtn.addEventListener('click', () => {
    sideMenu.classList.remove('show');
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sideMenu.classList.remove('show');
    }
});

document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorContainer = document.getElementById("error-message");

    // Clear previous error message
    errorContainer.textContent = '';
    errorContainer.style.display = 'none';

    // Validate email format
    if (!validateEmail(email)) {
        errorContainer.textContent = "Please enter a valid email.";
        errorContainer.style.display = 'block';
        return;
    }

    try {
        // Make a POST request to the server with email and password
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // Redirect to home page if login is successful
            window.location.href = data.redirectUrl;
        } else {
            // Display error message if login fails
            errorContainer.textContent = data.message;
            errorContainer.style.display = 'block';
        }
    } catch (error) {
        errorContainer.textContent = 'Network error, please try again';
        errorContainer.style.display = 'block';
    }
});

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const eyeIcon = document.querySelector(".eye-icon i"); 
  
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      eyeIcon.classList.remove("fa-eye");
      eyeIcon.classList.add("fa-eye-slash"); 
    } else {
      passwordInput.type = "password";
      eyeIcon.classList.remove("fa-eye-slash");
      eyeIcon.classList.add("fa-eye"); 
    }
  }
  
  // ... (Your other JavaScript code, if any) ...

// Helper function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

=======

document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});


document.getElementById("form").addEventListener("submit", function(event) {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    if (email === "" || password === "") {
        event.preventDefault(); 
        alert("Please fill out all fields.");
    } else if (!validateEmail(email)) {
        event.preventDefault(); 
        alert("Please enter a valid email.");
    }
});


function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
>>>>>>> 2e8bbfa (signup page updated)
