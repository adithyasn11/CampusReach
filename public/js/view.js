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
  const facultyCardsContainer = document.getElementById("faculty-cards-container");
  const searchInput = document.getElementById("searchInput");
  const noResultsMessage = document.getElementById("no-results-message");
  let usn = ""; // Variable to store the USN
  let facultyData = []; // Store fetched faculty data for search

  // Fetch USN
  async function fetchUsn() {
    try {
      const response = await fetch("/api/profile1", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include session cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch USN. Please log in.");
      }

      const data = await response.json();

      if (data.usn) {
        usn = data.usn; 
        username=data.name;
        console.log("USN fetched:", usn); 
        console.log("USN fetched:", username);// Log the USN to the console
      } else {
        console.error("USN not found in response.");
      }
    } catch (error) {
      console.error("Error fetching USN:", error);
    }
  }

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
      facultyCardsContainer.innerHTML = `<p>Unable to load faculty directory. Please try again later.</p>`;
    }
  }

  // Display Faculty Data
  function displayFacultyData(data) {
    facultyCardsContainer.innerHTML = ""; // Clear the container

    if (!Array.isArray(data) || data.length === 0) {
      noResultsMessage.style.display = "block"; // Show "No results" message
      return;
    }

    noResultsMessage.style.display = "none"; // Hide "No results" message

    data.forEach((faculty) => {
      // Create faculty card
      const facultyCard = document.createElement("div");
      facultyCard.classList.add("card");

      facultyCard.innerHTML = `
        <img src="${faculty.profilePic || "img/dummy.jpg"}" alt="Faculty Photo" class="faculty-photo">
        <div class="faculty-info">
          <h3 class="faculty-name">${faculty.name || "Unknown Name"}</h3>
          <p class="faculty-department">${faculty.department || "Unknown Department"}</p>
          <p class="faculty-cabin">${faculty.cabin || "Unknown Cabin"}</p>
        </div>
        <span class="availability-indicator ${
          faculty.availability ? "available" : "unavailable"
        }"></span>
        <input type="text" placeholder="Type your message..." class="message-box" data-faculty-id="${
          faculty._id
        }" />
        <button class="send-button" data-faculty-id="${
          faculty._id
        }">Send</button>
      `;

      facultyCardsContainer.appendChild(facultyCard);
    });

    // Add event listeners for all send buttons
    const sendButtons = document.querySelectorAll(".send-button");
    sendButtons.forEach((button) => {
      button.addEventListener("click", handleSendMessage);
    });
  }

  // Handle Send Message
  async function handleSendMessage(event) {
    const button = event.target;
    const facultyId = button.getAttribute("data-faculty-id");
    const messageInput = document.querySelector(
      `.message-box[data-faculty-id="${facultyId}"]`
    );
    const message = messageInput.value.trim();

    if (!message) {
      alert("Please enter a message before sending.");
      return;
    }

    // Fetch USN before sending the message
    await fetchUsn();

    if (!usn) {
      alert("Unable to fetch USN. Please try again.");
      return;
    }

    try {
      const response = await fetch(`/api/faculty/message/${facultyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, msgusn: usn ,msgname:username}),
      });

      if (response.ok) {
        alert("Message sent successfully!");
        messageInput.value = ""; // Clear the input box
      } else {
        alert("Failed to send the message. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message.");
    }
  }

  // Perform Search for Faculty
  function searchFaculty(searchTerm) {
    const filteredFaculty = facultyData.filter((faculty) =>
      faculty.name && faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayFacultyData(filteredFaculty);
  }

  // Initialize Faculty Data Fetching
  await fetchFacultyData();

  // Add Real-Time Search Listener for Faculty
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    searchFaculty(searchTerm);
  });
});
