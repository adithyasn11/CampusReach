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
    const studentGrid = document.getElementById("StudentGrid");
    const studentSearchInput = document.getElementById("searchInput");
    const studentNoResults = document.querySelector(".no-results");

    let studentData = []; // Store fetched student data for search

    // Fetch Student Data
    async function fetchStudentData() {
        try {
            const response = await fetch("/api/students", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            console.log("Response from /api/students:", response);

            if (!response.ok) throw new Error("Failed to fetch student data");

            studentData = await response.json(); // Save data
            console.log("Student Data:", studentData);

            displayStudentData(studentData); // Display all students initially
        } catch (error) {
            console.error("Error fetching student data:", error);
            studentGrid.innerHTML = `<p>Unable to load student directory. Please try again later.</p>`;
        }
    }

    // Display Student Data
    function displayStudentData(data) {
        console.log("Displaying student data:", data); // Debugging: Log data to be displayed
        studentGrid.innerHTML = ""; // Clear the grid

        if (!Array.isArray(data) || data.length === 0) {
            studentNoResults.style.display = "block"; // Show "No results" message
            return;
        }

        studentNoResults.style.display = "none"; // Hide "No results" message
        data.forEach((student) => {
            const studentCard = document.createElement("div");
            studentCard.classList.add("student-card");

            studentCard.innerHTML = `
                <img src="${student.profilePic || 'img/dummy.jpg'}" alt="Student Photo" class="student-photo">
                <h3 class="student-name">${student.name || "Unknown Name"}</h3>
                <p class="student-usn">${student.usn || "Unknown USN"}</p>
                <p class="student-department">${student.department || "Unknown Department"}</p>
            `;

            studentGrid.appendChild(studentCard);
        });
    }

    // Perform Search for Students
    function searchStudents(searchTerm) {
        console.log("Searching for students with term:", searchTerm); // Debugging
        const filteredStudents = studentData.filter((student) =>
            student.name && student.name.toLowerCase().includes(searchTerm)
        );
        console.log("Filtered Students:", filteredStudents); // Debugging
        displayStudentData(filteredStudents); // Display filtered results
    }

    // Initialize Student Data Fetching
    await fetchStudentData();

    // Add Real-Time Search Listener for Students
    studentSearchInput.addEventListener("input", () => {
        const searchTerm = studentSearchInput.value.trim().toLowerCase();
        searchStudents(searchTerm);
    });
});
