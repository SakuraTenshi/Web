document.addEventListener("DOMContentLoaded", function () {
    fetch("blog.json")
        .then(response => response.json())
        .then(posts => {
            const blogContainer = document.getElementById("blog-posts");
            blogContainer.innerHTML = ""; 

            // Sort posts by date (newest first)
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.classList.add("content-box");

                // Format date nicely
                const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Convert simple formatting into HTML
                const formattedContent = parseBlogFormatting(post.content);

                postElement.innerHTML = `
                    <h2 class="blog-title">📝 ${post.title}</h2>
                    <p class="blog-date">📅 ${formattedDate}</p>
                    <div class="blog-content">${formattedContent}</div>
                `;

                blogContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error loading blog posts:", error));
});

// Function to parse simple formatting (newlines, bold, italics)
function parseBlogFormatting(text) {
    // Convert **highlighted** to <strong> (glowing pink)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Convert _italic_ to <em> (just italics, not glowing)
    text = text.replace(/(?<!\*)_(.*?)_(?!\*)/g, '<em>$1</em>');

    // Convert double newlines to paragraph breaks
    text = text.replace(/\n\s*\n/g, '</p><p>');

    // Wrap in <p> if not already wrapped
    return `<p>${text}</p>`;
}


