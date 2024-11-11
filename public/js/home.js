// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

// Typing effect for greeting message with dynamic user name
document.addEventListener("DOMContentLoaded", async function () {
    // Retrieve userName from localStorage or use 'User' as a default
    let userName = localStorage.getItem('userName') || 'User';

    if (!userName || userName === 'User') {
        try {
            const response = await fetch('/getUserName', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
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
    const secondaryText = document.createElement('h2'); // Create a new element for the second line
    secondaryText.classList.add('secondary-greeting');
    greetingText.parentNode.appendChild(secondaryText); // Append below the first greeting

    let i = 0, j = 0;

    // Typing effect for greeting message
    function typeGreeting() {
        if (i < greetingMessage.length) {
            greetingText.innerHTML += greetingMessage.charAt(i);
            i++;
            setTimeout(typeGreeting, 100); // Adjust typing speed here
        } else {
            setTimeout(typeSecondaryMessage, 500); // Delay before starting the secondary message
        }
    }

    // Typing effect for secondary message
    function typeSecondaryMessage() {
        if (j < secondaryMessage.length) {
            secondaryText.innerHTML += secondaryMessage.charAt(j);
            j++;
            setTimeout(typeSecondaryMessage, 40); // Adjust typing speed here for secondary message
        }
    }

    typeGreeting(); // Start typing the greeting message
});
