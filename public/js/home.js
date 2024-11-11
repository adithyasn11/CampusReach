// Toggle side menu
document.getElementById("hamburger").addEventListener("click", function() {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function() {
    document.getElementById("side-menu").classList.remove("show");
});

// Typing effect for greeting message with dynamic user name
document.addEventListener("DOMContentLoaded", async function () {
    // Fetch the user's name from localStorage or use 'User' as default
    let userName = localStorage.getItem('userName') || 'User';

    // Check if the user's name needs to be fetched from the server
    if (!userName || userName === 'User') {
        try {
            // Make an API call to fetch the user name from the server if not available in localStorage
            const response = await fetch('/getUserName', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const data = await response.json();
                userName = data.userName;
                localStorage.setItem('userName', userName); // Cache the user's name in localStorage
            }
        } catch (error) {
            console.error("Error fetching user name:", error);
        }
    }

    const greetingMessage = `Welcome, ${userName}!`;
    const greetingText = document.getElementById('greetingText');
    let i = 0;

    // Typing effect for greeting message
    function typeLetter() {
        if (i < greetingMessage.length) {
            greetingText.innerHTML += greetingMessage.charAt(i);
            i++;
            setTimeout(typeLetter, 100); // Adjust typing speed here
        }
    }

    typeLetter();
});
