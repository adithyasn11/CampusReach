document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";

    const name = document.getElementById("name").value;
    const usn = document.getElementById("usn").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (name === "" || usn === "" || email === "" || password === "" || confirmPassword === "") {
        errorMessage.textContent = "Please fill out all fields.";
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
        const response = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, usn: uppercaseUsn, email, password })
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

function togglePasswordVisibility(inputId, iconId) {
    const passwordInput = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    icon.addEventListener("click", function() {
        const isPassword = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPassword ? "text" : "password");
        icon.classList.toggle("fa-eye-slash");
        icon.classList.toggle("fa-eye");
    });
}

togglePasswordVisibility("password", "togglePassword");
togglePasswordVisibility("confirm-password", "toggleConfirmPassword");