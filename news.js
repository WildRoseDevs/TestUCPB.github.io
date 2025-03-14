let initialLoad = 4;
let loadIncrement = 2;

// Tracks how many articles we've currently displayed
let currentCount = 0;

// The articles array (9 total).
// NOTE: Use YYYY-MM-DD so the month filter works properly.
const articles = [
    {
        category: "HEALTH",
        date: "2025-01-15",
        title: "Health Initiative Update",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "ECONOMY",
        date: "2025-02-05",
        title: "Economic Growth Prospects",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "GENERAL",
        date: "2025-02-20",
        title: "John Middleton-Hope as Lethbridge–West UCP Candidate",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "SOCIAL",
        date: "2025-03-01",
        title: "Community Outreach Program",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "HEALTH",
        date: "2025-01-10",
        title: "New Healthcare Facility Opening",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "ECONOMY",
        date: "2025-03-18",
        title: "Budget 2025 Announcement",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "GENERAL",
        date: "2025-01-25",
        title: "Town Hall Q&A Session",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "SOCIAL",
        date: "2025-02-10",
        title: "Community Sports Funding",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    },
    {
        category: "ECONOMY",
        date: "2025-03-27",
        title: "Small Business Grants",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        thumbnail: "images/Suport Alberta.jpg"
    }
];

// The array we actually render might be filtered by month
let filteredArticles = [...articles];

/**
 * Render articles into #articleWrapper. 
 * If clear=true, reset from scratch (used when filtering).
 */
function renderArticles(arr, clear = true) {
    const wrapper = document.getElementById("articleWrapper");
    if (!wrapper) return;

    // If we're clearing, reset the container & counters
    if (clear) {
        wrapper.innerHTML = "";
        currentCount = 0;
    }

    // If we are starting fresh (clear=true), show initialLoad.
    // Otherwise, show loadIncrement more.
    const numToShow = (currentCount === 0) ? initialLoad : loadIncrement;
    const endIndex = currentCount + numToShow;

    for (let i = currentCount; i < endIndex && i < arr.length; i++) {
        const art = arr[i];

        // Create the DOM element for each article
        const articleDiv = document.createElement("div");
        articleDiv.classList.add("news-article");

        // Category + date in one line
        // The "category" might get color from .health, .economy, .social, etc.
        // We add a <span> for the date with a "article-date" class
        articleDiv.innerHTML = `
      <div class="article-image">
        <img src="${art.thumbnail}" alt="${art.title}" />
      </div>
      <div class="article-content">
        <p class="category ${art.category.toLowerCase()}">
          ${art.category}
          <span class="article-date">${art.date}</span>
        </p>
        <h2 class="article-title">${art.title}</h2>
        <p>${art.description}</p>
      </div>
    `;

        wrapper.appendChild(articleDiv);
    }

    currentCount += numToShow;

    // If we've displayed everything, hide "Load More" button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
        if (currentCount >= arr.length) {
            loadMoreBtn.style.display = "none";
        } else {
            loadMoreBtn.style.display = "inline-block";
        }
    }
}

// Handle the loadMore button
const loadMoreBtn = document.getElementById("loadMoreBtn");
if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", function () {
        renderArticles(filteredArticles, false);
    });
}

/**
 * Filter by month (January, February, March) 
 * and re-render from scratch.
 */
function handleMonthChange() {
    const monthSelect = document.getElementById("select-month");
    if (!monthSelect) return;

    const selectedMonth = monthSelect.value; // e.g. "January", "February", "March"

    // Filter articles that match the selected month
    filteredArticles = articles.filter(art => {
        // Convert art.date (YYYY-MM-DD) to a JS Date
        const d = new Date(art.date);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const articleMonthName = monthNames[d.getMonth()];
        return articleMonthName === selectedMonth;
    });

    // Re-render the filtered array (first 4, then 2, etc.)
    renderArticles(filteredArticles);
}

// Listen for changes on the dropdown
const monthSelect = document.getElementById("select-month");
if (monthSelect) {
    monthSelect.addEventListener("change", handleMonthChange);
}

// Initial load: show all articles (first 4)
renderArticles(articles);


function scrollToContact() {
    document.getElementById('contact-info').scrollIntoView({ behavior: 'smooth' });
}