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

document.getElementById("form").addEventListener("submit", function(event) {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    
    if (email === "" || password === "") {
        event.preventDefault(); 
        errorMessage.textContent = "Please fill out all fields";
        errorMessage.style.display = "block";
        return;
    } else if (!validateEmail(email)) {
        event.preventDefault(); 
        errorMessage.textContent = "Please enter a valid email address";
        errorMessage.style.display = "block";
        return;
    }
});

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.getElementById("togglePassword").addEventListener("click", function() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});

document.getElementById("form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            window.location.href = result.redirectUrl;
        } else {
            const errorMessageElement = document.getElementById("error-message");
            errorMessageElement.textContent = result.message;
            errorMessageElement.style.display = "block";
        }
    } catch (error) {
        console.error("Error occurred:", error);
        alert(`An error occurred: ${error.message || "Please try again."}`);
    }
});
