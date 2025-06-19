const API_KEY = '7af5df540315033fef1763555218c8b9';
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

const movieContainer = document.querySelector('.popular_movies');

let genreMap = {};

function getWatchlist() {
  const stored = localStorage.getItem('watchlist');
  return stored ? JSON.parse(stored) : [];
}

function saveWatchlist(list) {
  localStorage.setItem('watchlist', JSON.stringify(list));
}

function isInWatchlist(movieId) {
  const watchlist = getWatchlist();
  return watchlist.some(movie => movie.id === movieId);
}

function addToWatchlist(movie) {
  const watchlist = getWatchlist();
  if (!watchlist.some(m => m.id === movie.id)) {
    watchlist.push(movie);
    saveWatchlist(watchlist);
    return true;
  }
  return false;
}

function removeFromWatchlist(movieId) {
  let watchlist = getWatchlist();
  watchlist = watchlist.filter(m => m.id !== movieId);
  saveWatchlist(watchlist);
}

fetch(GENRE_URL)
  .then(response => response.json())
  .then(data => {
    data.genres.forEach(genre => {
      genreMap[genre.id] = genre.name;
    });

    return fetch(API_URL);
  })
  .then(response => response.json())
  .then(data => {
    const movies = data.results.slice(0, 5);
    movieContainer.innerHTML = '';

    movies.forEach((movie, index) => {
      const genreNames = movie.genre_ids.map(id => genreMap[id]).join(', ');

      const movieElement = document.createElement('div');
      movieElement.classList.add('movie_feature');

      movieElement.innerHTML = `
        <div class="movie_number">${index + 1}</div>
        <div class="movie_picture">
          <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}">
        </div>
        <div class="about_movie">
          <h3>${movie.title}</h3>
          <p class="subject">${movie.overview || "No description available."}</p>
          <p class="type">${genreNames}</p>
          <p>⭐ ${movie.vote_average.toFixed(1)}/10</p>
          <button class="watchlist">${isInWatchlist(movie.id) ? 'Added to Watchlist' : 'Add to watchlist'}</button>
        </div>
      `;

      const btn = movieElement.querySelector('.watchlist');

      btn.addEventListener('click', () => {
        if (!isInWatchlist(movie.id)) {
          addToWatchlist(movie);
          btn.textContent = 'Remove from Watchlist';
        } else {
          removeFromWatchlist(movie.id);
          btn.textContent = 'Add to watchlist';
        }
      });

      movieContainer.appendChild(movieElement);
    });
  })
  .catch(error => {
    console.error('Error:', error);
    movieContainer.innerHTML = '<p style="color:red;">Failed to load movies. Please try again later.</p>';
  });
