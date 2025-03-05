// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  const questionSelect = document.getElementById("questionSelect");
  const timeframeSelect = document.getElementById("timeframeSelect");
  const deleteButton = document.getElementById("deleteButton");
  const voteLogTable = document.getElementById("voteLogTable");

  // Initialize Chart.js charts
  const histogramCtx = document.getElementById("histogramChart").getContext("2d");
  const pieCtx = document.getElementById("pieChart").getContext("2d");

  // Histogram (bar) chart
  const histogramChart = new Chart(histogramCtx, {
    type: "bar",
    data: {
      labels: ["Yay", "Nay"],
      datasets: [
        {
          label: "Number of Votes",
          data: [0, 0],
          backgroundColor: ["#4CAF50", "#F44336"]
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Pie chart
  const pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Yay", "Nay"],
      datasets: [
        {
          label: "Votes",
          data: [0, 0],
          backgroundColor: ["#808080", "#808080"] // Default grey (in case there's no data)
        }
      ]
    },
    options: {
      responsive: true
    }
  });

  // 1) Fetch questions and populate dropdown
  fetchQuestions().then((questions) => {
    populateQuestionSelect(questions);
    // Auto-select first question and update
    if (questions.length > 0) {
      questionSelect.value = questions[0].id;
      updateDashboard();
    }
  });

  // 2) Listen for changes on question and timeframe
  questionSelect.addEventListener("change", updateDashboard);
  timeframeSelect.addEventListener("change", updateDashboard);

  // 3) Handle "Delete Data" popup
  deleteButton.addEventListener("click", () => {
    document.getElementById("deletePopup").style.display = "flex";
  });
  document.getElementById("confirmDelete").addEventListener("click", deleteVotes);
  document.getElementById("cancelDelete").addEventListener("click", () => {
    document.getElementById("deletePopup").style.display = "none";
  });

  /**
   * Main function to update the dashboard whenever question or timeframe changes.
   */
  async function updateDashboard() {
    const selectedQuestionId = questionSelect.value;
    const timeframe = timeframeSelect.value;

    // Fetch votes from the server
    const votes = await fetchVotes(selectedQuestionId, timeframe);

    // Calculate counts for "yay" and "nay"
    const yayCount = votes.filter((v) => v.vote === "yay").length;
    const nayCount = votes.filter((v) => v.vote === "nay").length;

    // Update histogram chart
    histogramChart.data.datasets[0].data = [yayCount, nayCount];
    histogramChart.update();

    // Update pie chart
    if (yayCount + nayCount === 0) {
      // No data => grey slices
      pieChart.data.datasets[0].data = [0, 0];
      pieChart.data.datasets[0].backgroundColor = ["#808080", "#808080"];
    } else {
      // There is data => green/red slices
      pieChart.data.datasets[0].data = [yayCount, nayCount];
      pieChart.data.datasets[0].backgroundColor = ["#4CAF50", "#F44336"];
    }
    pieChart.update();

    // Update the live vote log table
    updateVoteLog(votes);
  }

  /**
   * Fetch the list of questions for the dropdown.
   */
  async function fetchQuestions() {
    const res = await fetch("/api/questions");
    if (!res.ok) throw new Error("Failed to fetch questions");
    return await res.json();
  }

  /**
   * Fetch votes from /api/votes, passing questionId and timeframe.
   */
  async function fetchVotes(questionId, timeframe) {
    // e.g. GET /api/votes?questionId=1&timeframe=24h
    const res = await fetch(`/api/votes?questionId=${questionId}&timeframe=${timeframe}`);
    if (!res.ok) throw new Error("Failed to fetch votes");
    return await res.json();
  }

  /**
   * Update the vote log table in the DOM.
   */
  function updateVoteLog(votes) {
    voteLogTable.innerHTML = "";

    // Sort by newest first if you want
    votes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    votes.forEach((vote) => {
      const row = document.createElement("tr");

      const dateCell = document.createElement("td");
      dateCell.textContent = new Date(vote.timestamp).toLocaleString();
      row.appendChild(dateCell);

      const questionCell = document.createElement("td");
      questionCell.textContent = `Bill ${vote.question}`;
      row.appendChild(questionCell);

      const voteCell = document.createElement("td");
      voteCell.textContent = vote.vote.toUpperCase();
      row.appendChild(voteCell);

      voteLogTable.appendChild(row);
    });
  }

  /**
   * Delete votes for the currently selected question.
   */
  async function deleteVotes() {
    const selectedQuestionId = questionSelect.value;

    try {
      const res = await fetch("/api/delete-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: selectedQuestionId })
      });

      if (!res.ok) throw new Error("Failed to delete votes");

      alert("Votes deleted successfully.");
      document.getElementById("deletePopup").style.display = "none";
      updateDashboard(); // Refresh data
    } catch (err) {
      console.error(err);
      alert("Error deleting votes.");
    }
  }

  /**
   * Populate the <select> for questions.
   */
  function populateQuestionSelect(questions) {
    questionSelect.innerHTML = "";
    questions.forEach((q) => {
      const option = document.createElement("option");
      option.value = q.id;
      option.textContent = q.text;
      questionSelect.appendChild(option);
    });
  }
});
