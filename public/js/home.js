// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

// Ensure side menu closes if screen is resized above mobile size
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

// Typing effect for greeting message with dynamic user name
document.addEventListener("DOMContentLoaded", async function () {
    let userName = localStorage.getItem('userName') || 'User';

    if (!userName || userName === 'User') {
        try {
            const response = await fetch('/getUserName', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                userName = data.userName || 'User';
                localStorage.setItem('userName', userName);
            } else {
                console.error('Failed to retrieve user name from server.');
                userName = 'User';
            }
        } catch (error) {
            console.error("Error fetching user name:", error);
            userName = 'User';
        }
    }

    const greetingMessage = `Welcome, ${userName}!`;
    const secondaryMessage = `Explore our latest features and tools to enhance your campus experience.`;
    const greetingText = document.getElementById('greetingText');
    const secondaryText = document.createElement('h2');
    secondaryText.classList.add('secondary-greeting');
    greetingText.parentNode.appendChild(secondaryText);

    let i = 0, j = 0;

    function typeGreeting() {
        if (i < greetingMessage.length) {
            greetingText.innerHTML += greetingMessage.charAt(i);
            i++;
            setTimeout(typeGreeting, 100);
        } else {
            setTimeout(typeSecondaryMessage, 500);
        }
    }

    function typeSecondaryMessage() {
        if (j < secondaryMessage.length) {
            secondaryText.innerHTML += secondaryMessage.charAt(j);
            j++;
            setTimeout(typeSecondaryMessage, 40);
        }
    }

    typeGreeting();
});

// Logout function
document.getElementById("logout-button").addEventListener("click", async function() {
    try {
        const response = await fetch("/logout", {
            method: "GET",
            credentials: "include"
        });

        if (response.ok) {
            localStorage.clear(); // Clear localStorage to remove any cached data
            window.location.href = "/login.html";
        } else {
            alert("Logout failed. Please try again.");
        }
    } catch (error) {
        console.error("Error during logout:", error);
    }
});
