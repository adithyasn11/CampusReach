// Toggle side menu display on hamburger click
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

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Fetch profile data from the server (session-based)
        const response = await fetch(`/api/profile`, { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error('Please log in first.');

        const userData = await response.json();
        
        // Display user data on the profile page
        document.getElementById('username').textContent = userData.username || 'N/A';
        document.getElementById('email').textContent = userData.email || 'N/A';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('alternate-email').value = userData.alternateEmail || '';
        document.getElementById('address').value = userData.address || '';
    } catch (error) {
        alert("Please log in first.");
        console.error('Error loading profile:', error);
        window.location.href = "/login.html";
    }
});

// Update profile data when save button is clicked
document.getElementById("save-button").addEventListener("click", async function() {
    const updatedData = {
        phone: document.getElementById("phone").value,
        alternateEmail: document.getElementById("alternate-email").value,
        address: document.getElementById("address").value
    };

    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Ensure credentials (session) are included
            body: JSON.stringify(updatedData)
        });

        alert(response.ok ? "Profile updated successfully!" : "Failed to update profile.");
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Error updating profile.");
    }
});
