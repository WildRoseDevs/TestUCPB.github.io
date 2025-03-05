// voting.js
document.addEventListener("DOMContentLoaded", () => {
    // Grab all vote buttons
    const voteButtons = document.querySelectorAll(".vote-button");
  
    // Grab the popup and close button
    const votePopup = document.getElementById("vote-popup");
    const closeButton = document.getElementById("vote-popup-close");
  
    // Hide popup on "X" click
    closeButton.addEventListener("click", () => {
      votePopup.classList.add("hidden");
    });
  
    // Load the list of questions user has already voted on (from localStorage)
    let votedQuestions = JSON.parse(localStorage.getItem("votedQuestions")) || [];
  
    voteButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        const question = button.dataset.question; // e.g. "1"
        const vote = button.dataset.vote;         // e.g. "yay"
  
        // 1) Check if user already voted on this question
        if (votedQuestions.includes(question)) {
          // Option A: Show a small popup that says "Already voted!"
          // Option B: Do nothing or show a message in the console
          console.log("User already voted on question", question);
          return; // Exit without sending request
        }
  
        // 2) Send vote to server
        try {
          const response = await fetch("/vote", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question, vote })
          });
  
          if (!response.ok) {
            // If server error
            console.error("Server error:", response.status);
            return;
          }
  
          // 3) If successful: store question in localStorage + show popup
          votedQuestions.push(question);
          localStorage.setItem("votedQuestions", JSON.stringify(votedQuestions));
  
          // Show the "You Are Heard!" popup
          votePopup.classList.remove("hidden");
  
          // Optionally add a wave animation or color change to the clicked button:
          // button.classList.add(vote === "yay" ? "yay-wave" : "nay-wave");
          // setTimeout(() => {
          //   button.classList.remove(vote === "yay" ? "yay-wave" : "nay-wave");
          //   button.classList.add(vote === "yay" ? "final-green" : "final-red");
          // }, 1000);
  
        } catch (error) {
          console.error("Error recording vote:", error);
        }
      });
    });
  });
  