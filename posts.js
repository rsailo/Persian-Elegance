// Fetch and render the most recent posts on the homepage
async function loadFeaturedPosts() {
  const postsGrid = document.getElementById('homePostGrid');
  if (!postsGrid) return;

  try {
    const res = await fetch('/public/stories');
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) {
      postsGrid.innerHTML = '<div class="empty-state">No stories found. Check back later for new posts.</div>';
      return;
    }

    const recentPosts = posts.slice(0, 4);
    window.homeStories = recentPosts;
    postsGrid.innerHTML = recentPosts.map((post) => `
      <article class="home-post-card">
        <div class="home-post-image-box">
          <img src="${post.image || 'assets/post1.jpg'}" alt="${post.title}">
        </div>
        <div class="home-post-content">
          <div class="story-heading-block">
            <h3>${post.title}</h3>
            <div class="story-heading-meta">
              <span class="author-chip">By ${post.author}</span>
              <span class="story-date-pill">${post.date}</span>
            </div>
          </div>
          <p class="content-preview">${truncateText(post.content, 240)}</p>
          <div class="story-footer">
            <button class="read-full" onclick="handleHomeRead('${post._id}')">Read Full</button>
          </div>
        </div>
      </article>
    `).join('');
  } catch (err) {
    console.error('Failed to load posts', err);
    postsGrid.innerHTML = '<div class="empty-state">Unable to load stories right now.</div>';
  }
}

function truncateText(text, maxLength) {
  if (!text) return '';
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > maxLength ? normalizedText.slice(0, maxLength).trimEnd() + '...' : normalizedText;
}

function closeOverlay() {
  const overlay = document.getElementById('storyOverlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

function openHomeOverlay(story) {
  const overlay = document.getElementById('storyOverlay');
  const overlayContent = document.getElementById('overlayContent');
  if (!overlay || !overlayContent || !story) return;

  const imageSrc = story.image || 'assets/post1.jpg';
  overlayContent.innerHTML = `
    <button class="close-btn" onclick="closeOverlay()">Close</button>
    <div class="overlay-image-wrap simple-overlay-image">
      <img src="${imageSrc}" alt="${story.title}" />
    </div>
    <div class="overlay-copy simple-overlay-copy">
      <h2>${story.title}</h2>
      <div class="overlay-meta">
        <span class="author-chip">By ${story.author}</span>
        <span class="story-date-pill">${story.date}</span>
      </div>
    </div>
    <div class="overlay-body simple-overlay-body">
      <p class="overlay-content" style="white-space: pre-wrap;">${story.content}</p>
    </div>
  `;
  overlay.style.display = 'block';
}

function handleHomeRead(storyId) {
  const stories = window.homeStories || [];
  const story = stories.find((item) => item._id === storyId);
  if (story) {
    openHomeOverlay(story);
  }
}

document.addEventListener('DOMContentLoaded', loadFeaturedPosts);
