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

// Load profile data on page load
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch(`/api/profile`, { method: 'GET', credentials: 'include' });
        if (!response.ok) throw new Error('Please log in first.');

        const userData = await response.json();
        document.getElementById('username').textContent = userData.username || 'N/A';
        document.getElementById('email').textContent = userData.email || 'N/A';
        document.getElementById('phone').value = userData.phone || '';
        document.getElementById('address').value = userData.address || '';
        document.getElementById('usn').value = userData.usn || '';
        
        if (userData.profilePic) {
            document.getElementById('profile-pic').src = userData.profilePic;
        }
    } catch (error) {
        alert("Please log in first.");
        window.location.href = "/login.html";
    }
});

// Update profile data when save button is clicked
document.getElementById("save-button").addEventListener("click", async function() {
    const updatedData = {
        phone: document.getElementById("phone").value,
        usn: document.getElementById("usn").value,
        address: document.getElementById("address").value
    };

    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(updatedData)
        });

        alert(response.ok ? "Profile updated successfully!" : "Failed to update profile.");
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Error updating profile.");
    }
});

// Profile picture upload functionality
document.getElementById("file-input").addEventListener("change", async function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
        const response = await fetch("/api/uploadProfilePic", {
            method: "POST",
            credentials: "include",
            body: formData
        });
        const result = await response.json();

        if (response.ok) {
            document.getElementById("profile-pic").src = result.imageUrl;
            alert("Profile picture updated successfully!");
        } else {
            alert(result.message || "Failed to upload profile picture.");
        }
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("An error occurred while uploading the profile picture.");
    }
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
