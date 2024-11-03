document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

document.getElementById("form").addEventListener("submit", function(event) {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    if (email === "" || password === "" || confirmPassword === "") {
        event.preventDefault(); 
        alert("Please fill out all fields.");
    } else if (!validateEmail(email)) {
        event.preventDefault(); 
        alert("Please enter a valid email.");
    } else if (password !== confirmPassword) {
        event.preventDefault(); 
        alert("Passwords do not match.");
    }
});

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
