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
    const facultyGrid = document.getElementById("facultyGrid");
    const searchInput = document.getElementById("searchInput");
    const noResults = document.querySelector(".no-results");
    let facultyData = []; // Store fetched faculty data for search

    // Fetch Faculty Data
    async function fetchFacultyData() {
        try {
            const response = await fetch("/api/faculty", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch faculty data");

            facultyData = await response.json(); // Save data
            displayFacultyData(facultyData); // Display all faculty initially
        } catch (error) {
            console.error("Error fetching faculty data:", error);
            facultyGrid.innerHTML = `<p>Unable to load faculty directory. Please try again later.</p>`;
        }
    }

    // Display Faculty Data
    function displayFacultyData(data) {
        facultyGrid.innerHTML = ""; // Clear the grid

        if (data.length === 0) {
            noResults.style.display = "block"; // Show "No results" message
            return;
        }

        noResults.style.display = "none"; // Hide "No results" message
        data.forEach((faculty) => {
            const facultyCard = document.createElement("div");
            facultyCard.classList.add("faculty-card");

            facultyCard.innerHTML = `
                <img src="${faculty.profilePic || 'images/default-profile.png'}" alt="Faculty Photo" class="faculty-photo">
                <h3 class="faculty-name">${faculty.name}</h3>
                <p class="faculty-post">${faculty.designation || "Faculty Member"}</p>
                <p class="faculty-designation">${faculty.department || "Unknown Department"}</p>
                <p class="faculty-designation">${faculty.cabin || "Unknown cabin"}</p>
            `;

            facultyGrid.appendChild(facultyCard);
        });
    }

    // Perform Search
    function searchFaculty(searchTerm) {
      const filteredFaculty = facultyData.filter((faculty) =>
          faculty.name.toLowerCase().includes(searchTerm)
      );
      displayFacultyData(filteredFaculty); // Display filtered results
  }

  // Initialize Faculty Data Fetching
  await fetchFacultyData();

  // Add Real-Time Search Listener
  searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      searchFaculty(searchTerm);
  });
});

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  searchFaculty(searchTerm);
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
      const searchTerm = searchInput.value.trim().toLowerCase();
      searchFaculty(searchTerm);
  }
});
