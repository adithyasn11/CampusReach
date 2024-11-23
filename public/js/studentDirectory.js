// Toggle Side Menu
document.getElementById("hamburger").addEventListener("click", function () {
    document.getElementById("side-menu").classList.add("show");
});

document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("side-menu").classList.remove("show");
});

// Close Side Menu on Screen Resize
window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        document.getElementById("side-menu").classList.remove("show");
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    const studentCardsContainer = document.getElementById("student-cards-container");
    const searchInput = document.getElementById("searchInput");
    const noResultsMessage = document.getElementById("no-results-message");

    let studentData = []; // Store fetched student data for search

    // Fetch Student Data
    async function fetchStudentData() {
        try {
            const response = await fetch("/api/students", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch student data");

            studentData = await response.json(); // Save data
            displayStudentData(studentData); // Display all students initially
        } catch (error) {
            console.error("Error fetching student data:", error);
            studentCardsContainer.innerHTML = `<p>Unable to load student directory. Please try again later.</p>`;
        }
    }

    // Display Student Data
    function displayStudentData(data) {
        studentCardsContainer.innerHTML = ""; // Clear the container

        if (data.length === 0) {
            noResultsMessage.style.display = "block"; // Show "No results" message
            return;
        }

        noResultsMessage.style.display = "none"; // Hide "No results" message
        data.forEach((student) => {
            const studentCard = document.createElement("div");
            studentCard.classList.add("card");

            studentCard.innerHTML = `
                <img src="${student.profilePic || 'img/dummy.jpg'}" alt="Student Photo" class="student-photo">
                <h3 class="student-name">${student.name || "Unknown Name"}</h3>
                <p class="student-usn">${student.usn || "Unknown USN"}</p>
                <p class="student-department">${student.department || "Unknown Department"}</p>
            `;

            studentCardsContainer.appendChild(studentCard);
        });
    }

    // Perform Search for Students
    function searchStudents(searchTerm) {
        const filteredStudents = studentData.filter((student) =>
            student.name && student.name.toLowerCase().includes(searchTerm)
        );
        displayStudentData(filteredStudents); // Display filtered results
    }

    // Initialize Student Data Fetching
    await fetchStudentData();

    // Add Real-Time Search Listener for Students
    searchInput.addEventListener("input", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchStudents(searchTerm);
    });

    // Add Search Button Click Listener
    document.getElementById("searchButton").addEventListener("click", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchStudents(searchTerm);
    });
});
