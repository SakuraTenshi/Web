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

                // Convert markdown-like formatting into HTML
                const formattedContent = parseBlogFormatting(post.content);

                postElement.innerHTML = `
                    <h2>📝 ${post.title}</h2>
                    <h4>📅 ${formattedDate}</h4>
                    <div class="blog-content">${formattedContent}</div>
                `;

                blogContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error("Error loading blog posts:", error));
});

// Function to parse Markdown-like formatting
function parseBlogFormatting(text) {
    // Convert headings (#, ##, ###, ####)
    text = text.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Convert **bold**, *italic*
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Convert blockquotes (> text)
    text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

    // Convert unordered lists (- item)
    text = text.replace(/^- (.*$)/gm, '<li>$1</li>');
    text = text.replace(/<li>(.*?)<\/li>/gms, '<ul>$&</ul>');

    // Convert ordered lists (1. item)
    text = text.replace(/\d+\. (.*$)/gm, '<li>$1</li>');
    text = text.replace(/<li>(.*?)<\/li>/gms, '<ol>$&</ol>');

    // Convert inline code (`code`)
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Convert fenced code blocks (```code```) 
    text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Convert horizontal rule (---)
    text = text.replace(/^---$/gm, '<hr>');

    // Convert links [title](url)
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Convert highlight (==Sakura pink text==)
    text = text.replace(/==(.+?)==/g, '<span class="highlight">$1</span>');

    // Convert double spaces at end of line to <br>
    text = text.replace(/  \n/g, '<br>');

    // Convert double newlines to paragraphs
    text = text.replace(/\n\s*\n/g, '</p><p>');

    // Wrap remaining text in paragraphs
    return `<p>${text}</p>`;
}
