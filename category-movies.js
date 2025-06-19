document.addEventListener("DOMContentLoaded", function () {
    const API_KEY = '7af5df540315033fef1763555218c8b9';

    const genreNameToId = {
        "Action": 28,
        "Family": 10751,
        "Fantasy": 14,
        "Science Fiction": 878,
        "Comedy": 35,
        "Musical": 10402,
        "Drama": 18,
        "Animation": 16,
        "Horror": 27,
        "Superhero": 28,
        "Romance": 10752,
        "War": 10752
    };

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (!category || !(category in genreNameToId)) {
        document.body.innerHTML = '<h2>Invalid category.</h2>';
        return;
    }

    const genreId = genreNameToId[category];
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            showMovies(data.results, category);
        })
        .catch(error => {
            console.error('Failed to fetch movie data:', error);
            document.body.innerHTML = '<h2>Failed to load movie data.</h2>';
        });

    // localStorage'dan array olarak watchlist al
    function getWatchlist() {
        const list = localStorage.getItem('watchlist');
        if (!list) return [];
        try {
            return JSON.parse(list);
        } catch {
            return [];
        }
    }

    // localStorage'a watchlist'i kaydet
    function setWatchlist(list) {
        localStorage.setItem('watchlist', JSON.stringify(list));
    }

    function showMovies(movies, genreName) {
        document.body.innerHTML = '';

        const heading = document.createElement('h2');
        heading.textContent = `${genreName} Movies`;
        heading.style.textAlign = 'center';
        heading.style.marginTop = '20px';
        document.body.appendChild(heading);

        const container = document.createElement('div');
        container.className = 'category-grid';
        container.style.display = 'grid';
        container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        container.style.gap = '20px';
        container.style.padding = '20px';
        document.body.appendChild(container);

        let watchlist = getWatchlist();

        movies.slice(0, 12).forEach(movie => {
            const card = document.createElement('div');
            card.style.background = `url('https://image.tmdb.org/t/p/w500${movie.poster_path}') center/cover no-repeat`;
            card.style.height = '300px';
            card.style.borderRadius = '10px';
            card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
            card.style.color = 'white';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';
            card.style.justifyContent = 'flex-end';
            card.style.padding = '15px';
            card.style.cursor = 'default';
            card.style.transition = 'transform 0.3s ease';
            card.style.position = 'relative';

            card.addEventListener('mouseover', () => {
                card.style.transform = 'scale(1.05)';
            });
            card.addEventListener('mouseout', () => {
                card.style.transform = 'scale(1)';
            });

            const title = document.createElement('h3');
            title.textContent = movie.title;
            title.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
            title.style.margin = '0';

            const rating = document.createElement('p');
            rating.textContent = `⭐ ${movie.vote_average}/10`;
            rating.style.margin = '5px 0 10px 0';
            rating.style.textShadow = '1px 1px 3px rgba(0,0,0,0.7)';

            const button = document.createElement('button');
            button.style.padding = '6px 12px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontWeight = 'bold';
            button.style.fontSize = '0.9rem';
            button.style.backgroundColor = 'rgba(75,0,110,0.8)';
            button.style.color = 'white';
            button.style.alignSelf = 'start';

            const movieIdStr = movie.id.toString();
            if (watchlist.includes(movieIdStr)) {
                button.textContent = 'Remove from Watchlist';
                button.style.backgroundColor = 'rgba(150,0,0,0.9)';
            } else {
                button.textContent = 'Add to Watchlist';
            }

            button.addEventListener('click', (e) => {
                e.stopPropagation();
                watchlist = getWatchlist(); // güncel listeyi al

                if (watchlist.includes(movieIdStr)) {
                    // çıkar
                    watchlist = watchlist.filter(id => id !== movieIdStr);
                    button.textContent = 'Add to Watchlist';
                    button.style.backgroundColor = 'rgba(75,0,110,0.8)';
                } else {
                    // ekle
                    watchlist.push(movieIdStr);
                    button.textContent = 'Remove from Watchlist';
                    button.style.backgroundColor = 'rgba(150,0,0,0.9)';
                }
                setWatchlist(watchlist);
            });

            card.appendChild(title);
            card.appendChild(rating);
            card.appendChild(button);
            container.appendChild(card);
        });
    }
});
