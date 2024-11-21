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

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");
    const facultyCards = document.querySelectorAll(".faculty-card");
    const searchedFacultyContainer = document.getElementById("searchedFacultyContainer");
    const noResults = document.querySelector(".no-results");

    searchButton.addEventListener("click", () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let found = false;

        // Clear previous results
        searchedFacultyContainer.innerHTML = "";
        searchedFacultyContainer.style.display = "none";
        noResults.style.display = "none";

        facultyCards.forEach(card => {
            const name = card.dataset.name.toLowerCase();
            if (name.includes(searchTerm)) {
                found = true;

                // Clone and display the matched card
                const clonedCard = card.cloneNode(true);
                searchedFacultyContainer.appendChild(clonedCard);
                searchedFacultyContainer.style.display = "block";
            }
        });

        if (!found) {
            noResults.style.display = "block"; // Show "No results" message
        }
    });
});






document.addEventListener("DOMContentLoaded", async function () {
    const facultyList = document.querySelector(".faculty-list");
  
    // Fetch and display faculty data
    async function fetchFacultyData() {
      try {
        // Fetch faculty data from backend API
        const response = await fetch("/api/faculty", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
  
        if (!response.ok) throw new Error("Failed to fetch faculty data");
  
        const facultyData = await response.json();
  
        // Populate faculty list
        if (facultyData.length === 0) {
          facultyList.innerHTML = `<p>No faculty members found.</p>`;
        } else {
          facultyList.innerHTML = ""; // Clear any existing content
          facultyData.forEach((faculty) => {
            const facultyCard = document.createElement("div");
            facultyCard.classList.add("faculty-card");
  
            facultyCard.innerHTML = `
              <img src="${faculty.photo || 'default-profile.png'}" alt="${faculty.name}">
              <h3>${faculty.name}</h3>
              <p>${faculty.department}</p>
              <p>Contact: <a href="mailto:${faculty.email}">${faculty.email}</a></p>
            `;
  
            facultyList.appendChild(facultyCard);
          });
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
        facultyList.innerHTML = `<p>Unable to load faculty directory. Please try again later.</p>`;
      }
    }
  
    fetchFacultyData();
  
    // Add search functionality for faculty
    const searchInput = document.getElementById("faculty-search");
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.toLowerCase();
      const facultyCards = document.querySelectorAll(".faculty-card");
  
      facultyCards.forEach((card) => {
        const name = card.querySelector("h3").textContent.toLowerCase();
        const department = card.querySelector("p").textContent.toLowerCase();
  
        if (name.includes(query) || department.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
  