document.addEventListener("DOMContentLoaded", function () {
    const articlesContainer = document.querySelector("#articleWrapper");
    const loadMoreButton = document.querySelector("#loadMoreBtn");

    // All available articles (Stored in an array)
    const allArticles = [
        { category: "HEALTH", categoryClass: "health", title: "Health Initiative Update", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "ECONOMY", categoryClass: "economy", title: "Economic Growth Prospects", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
//        { category: "GENERAL", categoryClass: "general", title: "Legislative Reform Bill", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "GENERAL", categoryClass: "general", title: "John Middleton-Hope as Lethbridge-West UCP Candidate", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "{article_name1}.html" },
        { category: "SOCIAL", categoryClass: "social", title: "Community Outreach Program", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "EDUCATION", categoryClass: "education", title: "Education Policy Update", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "INFRASTRUCTURE", categoryClass: "infrastructure", title: "Infrastructure Development Plan", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "ENVIRONMENT", categoryClass: "environment", title: "New Sustainability Measures", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" },
        { category: "TECHNOLOGY", categoryClass: "technology", title: "AI and Automation in Alberta", image: "./images/Suport Alberta.jpg", description: "Lorem ipsum dolor sit amet...", link: "#" }
    ];

    let articlesLoaded = 0; // Start from 0
    const articlesPerLoad = 2; // Load 2 articles per click

    // Function to insert articles dynamically
    function renderArticles(startIndex, endIndex) {
        for (let i = startIndex; i < endIndex && i < allArticles.length; i++) {
            const article = allArticles[i];

            const articleElement = document.createElement("article");
            articleElement.classList.add("news-article");

            articleElement.innerHTML = `
                <div class="article-image">
                    <img src="${article.image}" alt="${article.category}" />
                </div>
                <div class="article-content">
                    <h3 class="category ${article.categoryClass}">${article.category}</h3>
                    <h2 class="article-title">${article.title}</h2>
                    <p>
                        ${article.description}
                        <a href="${article.link}" class="read-more">[...]</a>
                    </p>
                </div>
            `;

            articlesContainer.appendChild(articleElement);
        }
    }

    // Load the first 4 articles automatically when the page loads
    renderArticles(0, 4);
    articlesLoaded = 4;

    // Load more articles when the button is clicked
    loadMoreButton.addEventListener("click", function () {
        renderArticles(articlesLoaded, articlesLoaded + articlesPerLoad);
        articlesLoaded += articlesPerLoad;

        // Hide button if all articles are loaded
        if (articlesLoaded >= allArticles.length) {
            loadMoreButton.style.display = "none";
        }
    });
});


function scrollToContact() {
    document.getElementById('contact-info').scrollIntoView({ behavior: 'smooth' });
}