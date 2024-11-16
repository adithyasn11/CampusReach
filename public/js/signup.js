// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function () {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("side-menu").classList.remove("show");
});

// Hide side menu if window is resized above 768px
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// API Base URL for requests
const API_BASE_URL = window.location.hostname.includes("localhost")
    ? "http://localhost:3000" // Local server
    : "https://campus-reach.vercel.app"; // Vercel deployment

// Toggle password visibility
function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.addEventListener("click", function () {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        icon.classList.toggle("fa-eye-slash");
        icon.classList.toggle("fa-eye");
    });
}

togglePasswordVisibility("password", "togglePassword");
togglePasswordVisibility("confirm-password", "toggleConfirmPassword");

// Form submission
document.getElementById("form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";

    const name = document.getElementById("name").value;
    const usn = document.getElementById("usn").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Client-side validation
    if (name === "" || usn === "" || email === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "Please fill out all fields.";
        errorMessage.style.display = "block";
        return;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = "Please enter a valid email address.";
        errorMessage.style.display = "block";
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        errorMessage.style.display = "block";
        return;
    }

    // Convert usn to uppercase
    const uppercaseUsn = usn.toUpperCase();

    try {
        const response = await fetch(`${API_BASE_URL}/api/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, usn: uppercaseUsn, email, password }),
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = result.redirectUrl;
        } else {
            errorMessage.textContent = result.message;
            errorMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Signup error:", error);
        errorMessage.textContent = "Server error, please try again.";
        errorMessage.style.display = "block";
    }
});
