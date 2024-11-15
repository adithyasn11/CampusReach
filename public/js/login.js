// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

// Hide side menu if window is resized above 768px
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Toggle password visibility
document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

// Form submission
document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("error-message");
    
    // Clear any previous error messages
    errorMessageElement.style.display = "none";
    errorMessageElement.textContent = "";

    // Client-side validation
    if (!email || !password) {
        errorMessageElement.textContent = "Please fill out all fields";
        errorMessageElement.style.display = "block";
        return;
    } else if (!validateEmail(email)) {
        errorMessageElement.textContent = "Please enter a valid email address";
        errorMessageElement.style.display = "block";
        return;
    }

    // Attempt to log in via the server
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('userName', result.userName); // Store user's name for greeting
            window.location.href = result.redirectUrl;
        } else {
            errorMessageElement.textContent = result.message;
            errorMessageElement.style.display = "block";
        }
    } catch (error) {
        console.error("Error occurred:", error);
        alert(`An error occurred: ${error.message || "Please try again."}`);
    }
});
