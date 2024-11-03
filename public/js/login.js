document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
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

// Helper function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
