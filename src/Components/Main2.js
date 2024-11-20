import React, { useState, useEffect } from "react";
import Card from "./Card";

// Constant for API
const API_key = "&api_key=db95773a7fb212ba790d71f6adac0e7e";
const base_url = "https://api.themoviedb.org/3";

// List of movie categories
const categories = ["Popular", "Theatre", "Kids", "Drama", "Comedy"];

const Main = () => {
  // State variables
  const [movieData, setData] = useState([]);           // List of movies
  const [apiUrl, setApiUrl] = useState(base_url + "/discover/movie?sort_by=popularity.desc" + API_key);
  const [search, setSearch] = useState("");            // Search input text
  const [selectedMovie, setSelectedMovie] = useState(null);    // Movie selected for detailed view
  const [favorites, setFavorites] = useState([]);      // List of favorite movies
  const [showFavorites, setShowFavorites] = useState(false);   // Flag to toggle favorite view
  const [isLoading, setIsLoading] = useState(true);    // Loading flag

  // Fetch movies from API when `apiUrl` changes
  useEffect(() => {
    setIsLoading(true); // Show loading spinner
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results || []); // Store fetched movies
        setIsLoading(false); // Hide loading spinner
        console.log("Fetched movies:", data.results);
      })
      .catch(() => setIsLoading(false)); // Stop loading even if there's an error
  }, [apiUrl]);

  // Fetch favorites from local storage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
    console.log("Loaded favorites:", savedFavorites);
  }, []);

  // Update API URL based on selected category
  const getData = (category) => {
    let updatedUrl = "";
    if (category === "Popular") {
      updatedUrl = base_url + "/discover/movie?sort_by=popularity.desc" + API_key;
    } else if (category === "Theatre") {
      updatedUrl = base_url + "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22" + API_key;
    } else if (category === "Kids") {
      updatedUrl = base_url + "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc" + API_key;
    } else if (category === "Drama") {
      updatedUrl = base_url + "/discover/movie?with_genres=18&primary_release_year=2014" + API_key;
    } else if (category === "Comedy") {
      updatedUrl = base_url + "/discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc" + API_key;
    }

    setApiUrl(updatedUrl);
  };

  // Search for a movie by title
  const searchMovie = () => {
    if (search.trim() !== "") {
      const url = base_url + "/search/movie?api_key=db95773a7fb212ba790d71f6adac0e7e&query=" + search;
      setApiUrl(url);
      setSearch("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchMovie();
    }
  };

  // Open detailed view for a movie
  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  // Close the detailed view
  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

  // Toggle movie as a favorite
  const toggleFavorite = (movie) => {
    const updatedFavorites = [...favorites];
    const movieIndex = updatedFavorites.findIndex((fav) => fav.id === movie.id);

    if (movieIndex === -1) {
      updatedFavorites.push(movie);
    } else {
      updatedFavorites.splice(movieIndex, 1);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  // Toggle view between favorites and all movies
  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <>
      <div className="header">
        {/* List of categories */}
        <nav>
          <ul>
            {categories.map((category, pos) => (
              <li key={pos}>
                <a href="#" onClick={() => getData(category)}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle favorites button */}
        <button className="favorite-btn" onClick={toggleShowFavorites}>
          {showFavorites ? "Home Page" : "Favorites"}
        </button>

        {/* Search form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="search-btn">
            <input
              type="text"
              placeholder="Enter Movie Name"
              className="inputText"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              onKeyPress={handleKeyPress}
            />
            <button className="inputText" type="button" onClick={searchMovie}>
              <i className="fas fa-search"></i>
            </button>
          </div>
        </form>
      </div>

      {/* Display movies */}
      <div className="container">
        {isLoading ? (
          <p className="notfound">Loading...</p>
        ) : selectedMovie ? (
          <div className="movie-detail-modal">
            <h2>{selectedMovie.title}</h2>
            <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} />
            <p>{selectedMovie.overview}</p>
            <button className="close-btn" onClick={handleCloseDetail}>
              Close
            </button>
          </div>
        ) : (showFavorites ? favorites : movieData).length === 0 ? (
          <p className="notfound">Not Found</p>
        ) : (
          (showFavorites ? favorites : movieData).map((movie, pos) => (
            <Card
              info={movie}
              key={pos}
              onClick={handleMovieClick}
              toggleFavorite={toggleFavorite}
              isFavorite={favorites.some((fav) => fav.id === movie.id)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Main;
