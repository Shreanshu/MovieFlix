# MovieFlix

A third-party API based Movie and Trailer search application.

Technologies -
 1. HTML
 2. CSS
 3. JavaScript

The application is a representation of technologies like HTML, CSS and JavaScript.
Html renders all the static content with 'The Shawshank Redemptiom' movie details and its trailer by default.
CSS provides styling to the HTML elements using id, class and tag selectors and necessary combinators.
Upon user search the JavaScript fetches the movie details from OMDB API and Youtube Trailer/Teaser key from TMDB API using 'imdbID' and fetch method.
On 'click' event for the movie-suggestion, the JavaScript renders the movie details and its trailer/teaser using DOM Manipulation. The application uses 'YouTube IFrame' for rendering the movie trailer/teaser.

OMDB API - Fetches the movie details like title, genre, ratings, release date, director, writer, cast, plot and awards data.

TMDB API - Fetches the YouTube key for the movie trailer/teaser based on imdbID.

YouTube IFrame - Renders the movie trailer/teaser using the YouTube key, which includes addtional features like autoplay, loop playlist and audio & video controls.
