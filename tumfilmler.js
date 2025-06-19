const API_KEY = '7af5df540315033fef1763555218c8b9';
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
const GENRE_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.querySelector('.movie-grid');

let genreMap = {};
let watchlist = [];

// Kategorileri çek ve eşleştir
async function kategorileriGetir() {
    const res = await fetch(GENRE_URL);
    const data = await res.json();
    data.genres.forEach(g => {
        genreMap[g.id] = g.name;
    });
}

// LocalStorage'dan watchlist oku
function watchlistOku() {
    const stored = localStorage.getItem('watchlist');
    watchlist = stored ? JSON.parse(stored) : [];
}

// LocalStorage'a watchlist kaydet
function watchlistKaydet() {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Filmleri getir ve göster
async function filmleriGetir() {
    try {
        await kategorileriGetir();
        watchlistOku();

        const res = await fetch(API_URL);
        const data = await res.json();

        data.results.forEach(film => {
            const card = document.createElement('div');
            card.classList.add('movie-card');

            const kategoriIsimleri = film.genre_ids
                .map(id => genreMap[id] || "Unknown")
                .join(', ');

            card.innerHTML = `
                <img src="${IMAGE_BASE_URL + film.poster_path}" alt="${film.title}">
                <div class="movie-info">
                    <h3>${film.title}</h3>
                    <p class="movie-category">${kategoriIsimleri}</p>
                    <p>⭐ ${film.vote_average.toFixed(1)}/10</p>
                    <div class="action-buttons">
                        <button class="watchlist-btn">Add to Watchlist</button>
                    </div>
                </div>
            `;

            const btn = card.querySelector('.watchlist-btn');

            // Buton yazısını başta ayarla (ekli ise remove, değilse add)
            if (watchlist.find(f => f.id === film.id)) {
                btn.textContent = 'Remove from Watchlist';
            } else {
                btn.textContent = 'Add to Watchlist';
            }

            btn.addEventListener('click', () => {
                 btn.disabled = true;  // Tıklamayı engelle
                const index = watchlist.findIndex(f => f.id === film.id);

                if (index === -1) {
                    // Film watchlist'te yok, ekle
                    const filmObj = {
                        id: film.id,
                        title: film.title,
                        poster_path: film.poster_path,
                        vote_average: film.vote_average,
                        genres: kategoriIsimleri,
                    };
                    watchlist.push(filmObj);
                    watchlistKaydet();
                    btn.textContent = 'Remove from Watchlist';
                    
                } else {
                    // Film var, çıkar
                    watchlist.splice(index, 1);
                    watchlistKaydet();
                    btn.textContent = 'Add to Watchlist';
                    
                }
                btn.disabled = false;  // Butonu tekrar aktif et
            });

            movieGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

document.addEventListener('DOMContentLoaded', filmleriGetir);
