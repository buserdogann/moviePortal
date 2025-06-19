document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const genreName = card.querySelector('h3').textContent.trim();
      window.location.href = `category-movies.html?category=${encodeURIComponent(genreName)}`;
    });
  });
});
