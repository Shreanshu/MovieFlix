(function() {

    const OMDB_API_KEY = '7b25a22';
    const TMDB_API_KEY = '730b6f5541f273620f50d001d1738c9e';
    let movieList = [];



    let searchMovie = document.getElementById('search-movie');
    let cancelIcon = document.getElementById('cancel-icon');
    let movieSuggestions = document.getElementById('movie-suggestions');

    let moviePoster = document.getElementById('movie-poster');
    let movieDetails = document.getElementById('movie-details');
    let trailer = document.getElementById('trailer');
    let trailerSource = trailer.getAttribute('src');
    let loadingAnimation = document.getElementById('loading');



    searchMovie.addEventListener('keyup', () => { FindSuggestions(); DisplayCancelIcon(); ToggleTrailer() });
    searchMovie.addEventListener('focus', () => { FindSuggestions(); DisplayCancelIcon(); });
    cancelIcon.addEventListener('click', DeleteSearch);



    // window.addEventListener('click', (event) => {
    //     event.preventDefault();

    //     if (event.target.id !== "search-movie")
    //         movieSuggestions.innerHTML = "";
    //         loadingAnimation.style.display = "none";
    // });



    function FindSuggestions() {
        if (searchMovie.value.length > 1)
            {
                FetchMovieList(searchMovie.value.trim());
                DisplaySuggestions();
            }
    }

    async function FetchMovieList(searchText) {
        await fetch(`https://omdbapi.com/?s=${searchText}&page=1&apikey=${OMDB_API_KEY}`)
        .then( async (response) => response.status !== 404 ? await response.json() : null )
        .then( (movieData) => {
            if (movieData.Response === 'True')
                movieList = movieData.Search;
        })
        .catch( (error) => console.log(error) );
    }

    function DisplaySuggestions() {
        movieSuggestions.innerHTML = "";
        
        movieList.forEach( (movie) => {
            movieSuggestions.innerHTML += `
            <a class="movie" id="${movie.imdbID}">
                <div class="thumbnail">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : './assets/ImageNotFound.png'}" alt="Movie Thumbnail" class="thumbnail-icon">
                </div>

                <div class="movie-details">
                    <p>
                        ${movie.Title}
                    </p>
                    <p>
                        <span>${movie.Year}</span>
                        &nbsp;
                        &nbsp;
                        &nbsp;
                        <span>${movie.Type}</span>
                    </p>
                </div>
            </a>`
        });

        LoadMovieDetails();
    }



    function LoadMovieDetails() {
        let searchList = document.querySelectorAll('.movie');
        let selectedMovie;
        let selectedTrailer;

        searchList.forEach( (listItem) => {
            listItem.addEventListener('click', async () => {
                window.scrollBy(0, window.innerHeight);

                await fetch(`https://www.omdbapi.com/?i=${listItem.id}&apikey=${OMDB_API_KEY}`)
                .then( async (response) => response.status !== 404 ? await response.json() : null )
                .then( (movieData) => selectedMovie = movieData )
                .catch( (error) => console.log(error) );

                await fetch(`https://api.themoviedb.org/3/movie/${listItem.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`)
                .then( async (response) => response.status !== 404 ? await response.json() : null )
                .then( (movieTrailer) => selectedTrailer = movieTrailer )
                .catch( (error) => console.log(error) );

                DisplayMovie(selectedMovie);

                let key;
                if(selectedTrailer)
                    {
                        selectedTrailer?.results.forEach( (result) => {
                            if(result?.type === 'Trailer' || result?.type === 'Teaser')
                                key = result?.key;
                        });
                    }
                
                DisplayTrailer(key);
            });
        });
    }

    function DisplayMovie(movie) {
        function CreateGenre() {
            let genreList = movie["Genre"].split(",");

            let outerSpan = document.createElement('span');
            outerSpan.classList.add('genre-list');
            // outerSpan.id = 'genres';

            genreList.forEach( (genre) => {
                let innerSpan = document.createElement('span');
                innerSpan.classList.add('genre');
                innerSpan.innerText = genre.trim();

                outerSpan.append(innerSpan);
            });

            return outerSpan;
        }

        movieDetails.innerHTML = `
            <h3 class="movie-title" id="title">${movie.Title}</h3>

            <div class="subinfo-container">
                <p class="movie-rating">Rating - <span id="rating">${movie.Ratings[0].Value}</span></p>
                <p class="movie-rated">Rated - <span id="rated">${movie.Rated}</span></p>
                <p class="movie-released">Released - <span id="released">${movie.Released}</span></p>
            </div>
            
            <p class="movie-genre" id="genres">
                Genres  
            </p>

            <p class="movie-director">Director - <span id="director">${movie.Director}</span></p>

            <p class="movie-writer">Writer - <span id="writer">${movie.Writer}</span></p>

            <p class="movie-cast">Cast - <span id="cast">${movie.Actors}</span></p>

            <p class="movie-plot">Plot - <span id="plot">${movie.Plot}</span></p>

            <p class="movie-languages">Languages - <span id="languages">${movie.Language}</span></p>

            <p class="movie-awards">
                <i class="fa fa-solid fa-award"></i>
                <span id="awards">${movie.Awards}</span>
            </p>
        `;

        moviePoster.innerHTML = movie.Poster !== 'N/A' ?
        `<img src="${movie.Poster}" alt="Movie">` :
        `<img src="./assets/ImageNotFound.png" alt="Movie">`;

        document.getElementById('genres').append(CreateGenre());

        DeleteSearch();
    }

    function DisplayTrailer(key) {
        trailer.style.display = 'block';
        
        if(key)
            {
                trailerSource = `https://www.youtube-nocookie.com/embed/${key}?playlist=${key}&autoplay=1&autopause=0&mute=0&controls=0&loop=1&rel=0&enablejsapi=1&color=white&border=0&showinfo=0&showsearch=0&fs=1&hl=en_U&iv_load_policy=3`;
                trailer.setAttribute('src', trailerSource);
            }
        else
            {
                trailerSource = "";
                trailer.setAttribute('src', trailerSource);
            }
    }



    function ToggleTrailer() {
        if (searchMovie.value)
            {
                trailer.setAttribute('src', "");
            }
        else
            {               
                trailer.setAttribute('src', trailerSource);
            }
    }

    function DisplayCancelIcon() {
        if (searchMovie.value)
            {
                cancelIcon.style.display = 'block';
                loadingAnimation.style.display = 'block';
            }
        else
            {
                cancelIcon.style.display = 'none';
                loadingAnimation.style.display = 'none';

                movieSuggestions.innerHTML = "";
                movieList = [];
            }
    }

    function DeleteSearch() {
        searchMovie.value = "";
        cancelIcon.style.display = 'none';
        movieSuggestions.innerHTML = "";

        loadingAnimation.style.display = 'none';

        movieList = [];
        
        trailer.setAttribute('src', trailerSource);
    }

})();
