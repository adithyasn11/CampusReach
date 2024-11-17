// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function () {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("side-menu").classList.remove("show");
});

// Ensure side menu closes if screen is resized above mobile size
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

// Typing effect for greeting message with dynamic user name
document.addEventListener("DOMContentLoaded", function () {
    const greetingText = document.getElementById("greetingText");
    const secondaryText = document.createElement("h2");
    secondaryText.classList.add("secondary-greeting");
    greetingText.parentNode.appendChild(secondaryText);

    // Fetch the username from sessionStorage or set fallback
    const username = sessionStorage.getItem("username") || "User";

    const greetingMessage = `Welcome, ${username}!`;
    const secondaryMessage = `Explore our latest features and tools to enhance your campus experience.`;

    let i = 0, j = 0;

    // Typing effect for greeting message
    function typeGreeting() {
        if (i < greetingMessage.length) {
            greetingText.innerHTML += greetingMessage.charAt(i);
            i++;
            setTimeout(typeGreeting, 100); // Adjust typing speed here
        } else {
            setTimeout(typeSecondaryMessage, 500); // Delay before typing secondary message
        }
    }

    // Typing effect for secondary message
    function typeSecondaryMessage() {
        if (j < secondaryMessage.length) {
            secondaryText.innerHTML += secondaryMessage.charAt(j);
            j++;
            setTimeout(typeSecondaryMessage, 40); // Adjust typing speed for secondary message
        }
    }

    typeGreeting(); // Start typing the greeting message
});

// Logout function
document.getElementById("logout-button").addEventListener("click", async function () {
    try {
        const response = await fetch("/api/logout", {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            sessionStorage.clear(); // Clear sessionStorage to remove any cached data
            window.location.href = "/login.html";
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
});
