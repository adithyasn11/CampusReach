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
  let username = ""; // Variable to store the username
  let studentData = []; // Store fetched student data for search

  // Fetch Username
  async function fetchUsername() {
    try {
      const response = await fetch("/api/profile2", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Include session cookies
      });

      if (!response.ok) {
        throw new Error("Failed to fetch username. Please log in.");
      }

      const data = await response.json();

      if (data.name) {
        username = data.name;
        console.log("Username fetched:", username); // Log the username to the console
      } else {
        console.error("Username not found in response.");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  }

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

    if (!Array.isArray(data) || data.length === 0) {
      noResultsMessage.style.display = "block"; // Show "No results" message
      return;
    }

    noResultsMessage.style.display = "none"; // Hide "No results" message
    data.forEach((student) => {
      // Create student card
      const studentCard = document.createElement("div");
      studentCard.classList.add("card");

      studentCard.innerHTML = `
        <img src="${student.profilePic || "img/dummy.jpg"}" alt="Student Photo" class="student-photo">
        <div class="student-info">
          <h3 class="student-name">${student.name || "Unknown Name"}</h3>
          <p class="student-usn">${student.usn || "Unknown USN"}</p>
          <p class="student-department">${student.department || "Unknown Department"}</p>
        </div>
        <input type="text" placeholder="Type your message..." class="message-box" data-student-id="${
          student._id
        }" />
        <button class="send-button" data-student-id="${
          student._id
        }">Send</button>
      `;

      studentCardsContainer.appendChild(studentCard);
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
    const studentId = button.getAttribute("data-student-id");
    const messageInput = document.querySelector(
      `.message-box[data-student-id="${studentId}"]`
    );
    const message = messageInput.value.trim();

    if (!message) {
      alert("Please enter a message before sending.");
      return;
    }

    // Fetch Username before sending the message
    await fetchUsername();

    if (!username) {
      alert("Unable to fetch username. Please try again.");
      return;
    }

    try {
      const response = await fetch(`/api/students/message/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message, msgname: username }),
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

  // Perform Search for Students
  function searchStudent(searchTerm) {
    const filteredStudents = studentData.filter((student) =>
      student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    displayStudentData(filteredStudents);
  }

  // Initialize Student Data Fetching
  await fetchStudentData();

  // Add Real-Time Search Listener for Students
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.trim();
    searchStudent(searchTerm);
  });
});
