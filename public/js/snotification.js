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


document.addEventListener("DOMContentLoaded", async () => {
    const notificationsContainer = document.getElementById("notifications");

    // Fetch notifications from the API
    async function fetchNotifications() {
        try {
            const response = await fetch("/api/notifications", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Ensure session is included
            });

            if (!response.ok) throw new Error("Failed to fetch notifications");

            const notifications = await response.json(); // Array of messages
            displayNotifications(notifications); // Pass data to render
        } catch (error) {
            console.error("Error fetching notifications:", error);
            notificationsContainer.innerHTML = `<p>No notifications.</p>`;
        }
    }

    // Display notifications in the container
    function displayNotifications(messages) {
        notificationsContainer.innerHTML = ""; // Clear previous notifications

        if (!messages || messages.length === 0) {
            notificationsContainer.innerHTML = `<p>No new notifications.</p>`;
            return;
        }

        messages.forEach((message) => {
            // Format timestamp
            const timestamp = new Date(message.timestamp).toLocaleString();

            // Create notification card
            const notificationCard = document.createElement("div");
            notificationCard.classList.add("notification-card");

            // Populate card with message content
            notificationCard.innerHTML = `
                <div class="notification-content">
                    <p class="notification-message">Message: ${message.message || "No message provided"}</p>
                    <p class="notification-usn">Name: ${message.msgname || "Unknown"}</p>
                </div>
                <div class="notification-timestamp">${timestamp}</div>
            `;

            notificationsContainer.appendChild(notificationCard);
        });
    }

    // Fetch and render notifications on page load
    await fetchNotifications();
});
