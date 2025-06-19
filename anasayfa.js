// Scroll fonksiyonu (kaydırma butonları için)
function scrollMovies(containerId, direction) {
    const container = document.getElementById(containerId);
    const scrollAmount = container.clientWidth * 0.8; // genişliğin %80'i kadar kaydır
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// İzleme listesini localStorage'dan al ve ekrana yaz
function izlemeListesiniGoster() {
    const watchList = JSON.parse(localStorage.getItem('watchlist')) || [];
    const watchlistScroller = document.getElementById('watchlist-scroller');

    watchlistScroller.innerHTML = ''; // önce temizle

    if (watchList.length === 0) {
        watchlistScroller.innerHTML = '<p style="color: white; padding: 20px;">İzleme listeniz boş.</p>';
        return;
    }

    watchList.forEach(film => {
        const filmCard = document.createElement('div');
        filmCard.classList.add('movie-card');

        filmCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${film.poster_path}" alt="${film.title}">
            <div class="movie-info">
                <h3 title="${film.title}">${film.title}</h3>
                <p>⭐ ${film.vote_average.toFixed(1)} / 10</p>
                <button class="remove-btn">İzleme listesinden çıkar</button>
            </div>
        `;

        // Butona tıklanınca çıkarma işlemi
        filmCard.querySelector('.remove-btn').addEventListener('click', () => {
            watchListCikar(film.id);
        });

        watchlistScroller.appendChild(filmCard);
    });
}

// İzleme listesinden film çıkar
function watchListCikar(filmId) {
    let watchList = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchList = watchList.filter(f => f.id !== filmId);
    localStorage.setItem('watchlist', JSON.stringify(watchList));
    izlemeListesiniGoster(); // listeyi güncelle
}

// Sayfa yüklendiğinde izleme listesini göster
document.addEventListener('DOMContentLoaded', () => {
    izlemeListesiniGoster();
});
