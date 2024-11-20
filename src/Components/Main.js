import React, { useState, useEffect } from "react";
import Card from "./Card";

// Constant for api

const API_key = "&api_key=db95773a7fb212ba790d71f6adac0e7e";
const base_url = "https://api.themoviedb.org/3";

// List of movie categories

const categories = ["Popular", "Theatre", "Kids", "Drama", "Comedy"];

const Main = () => {
  //  state variables to store data
  const [movieData, setData] = useState([]);  // List of Movies 
  const [apiUrl, setApiUrl] = useState(base_url + "/discover/movie?sort_by=popularity.desc" + API_key);     // store default api url home page data movies
  const [search, setSearch] = useState("");   // search input text
  const [selectedMovie, setSelectedMovie] = useState(null);    // movie selected for details view
  const [favorites, setFavorites] = useState([]);  // Store favorite movies list
  const [showFavorites, setShowFavorites] = useState(false);  // Flag to toggle favorite view

  // Fetch movies from API when `apiUrl` changes

  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        setData(data.results);  // store the fetched movies
    console.log("useEffect fetch url-set --", apiUrl," store fetched movies --", data.results);
      });
  
  }, [apiUrl]);

  // Fetch favorite movies from localStorage when the component mounts

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);  // set favorites from local storage
    console.log("saved favorites movies details--- ", savedFavorites);
  }, []);

// Update API URL based on category selected

  const getData = (category) => {
    let updatedUrl = '';
    console.log("get data in updateUrl show",updatedUrl);
    if (category === "Popular") {
      updatedUrl = base_url + "/discover/movie?sort_by=popularity.desc" + API_key;
    }
    if (category === "Theatre") {
      updatedUrl = base_url + "/discover/movie?primary_release_date.gte=2014-09-15&primary_release_date.lte=2014-10-22" + API_key;
    }
    if (category === "Kids") {
      updatedUrl = base_url + "/discover/movie?certification_country=US&certification.lte=G&sort_by=popularity.desc" + API_key;
    }
    if (category === "Drama") {
      updatedUrl = base_url + "/discover/movie?with_genres=18&primary_release_year=2014" + API_key;
    }
    if (category === "Comedy") {
      updatedUrl = base_url + "/discover/movie?with_genres=35&with_cast=23659&sort_by=revenue.desc" + API_key;
    }

    setApiUrl(updatedUrl);     // Update the URL to fetch data for the selected category
    console.log("update the url fetch data select in category --", updatedUrl);
  };

  // Search for a movie by title when the "Enter" key is pressed

  const searchMovie = () => {
    if (search.trim() !== "") {
      const url = base_url + "/search/movie?api_key=db95773a7fb212ba790d71f6adac0e7e&query=" + search;
      setApiUrl(url);     // Update URL to search for movies
      setSearch("");       // Clear the search input
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchMovie();
    }
  };

   // Open detailed view for a movie when clicked

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);     // Set the selected movie for a detailed view
  };

  // Close the detailed view

  const handleCloseDetail = () => {
    setSelectedMovie(null);
  };

   // Add or remove a movie from favorites

  const toggleFavorite = (movie) => {
    const updatedFavorites = [...favorites];
    const movieIndex = updatedFavorites.findIndex((fav) => fav.id === movie.id);

    if (movieIndex === -1) {
       // If not in favorites, add it
      updatedFavorites.push(movie);  // Add to favorites
    } else {
         // If already in favorites, remove it
      updatedFavorites.splice(movieIndex, 1);  // Remove from favorites
    }

    setFavorites(updatedFavorites);   
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));  // Save to favorites in localStorage
  };

   // Toggle between showing all movies and only favorites

  const toggleShowFavorites = () => {
    setShowFavorites(!showFavorites);     // Switch the view between favorites and all movies
  };

  return (
    <>
    
      <div className="header">
        {/* list of categoies movies list */}
        <nav>
          <ul>
            {categories.map((category, pos) => (
              <li key={pos}>
                <a href="#" name={category} onClick={(e) => getData(e.target.name)}>
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* favorites movies button */}
        <button className="favorite-btn" onClick={toggleShowFavorites}>
          {showFavorites ? 'Home Page' : 'Favorites'}
        </button>
        {/* search movies show */}
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

      {/* Display the movie list or detailed view */}
      <div className="container">
        {selectedMovie ? (
          <div className="movie-detail-modal">
            <h2>{selectedMovie.title}</h2>
            <img src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`} alt={selectedMovie.title} />
            <p>{selectedMovie.overview}</p>
            <button className="close-btn" onClick={handleCloseDetail}>
              Close
            </button>
          </div>
        ) : (
          // Show either all movies or only favorites based on the toggle
          (showFavorites ? favorites : movieData).length === 0 ? (
            <p className="notfound">Not Found</p>
          ) : (
            (showFavorites ? favorites : movieData).map((movie, pos) => (
              <Card info={movie} key={pos} onClick={handleMovieClick} toggleFavorite={toggleFavorite} isFavorite={favorites.some(fav => fav.id === movie.id)} />
            ))
          )
        )}
      </div> 
    
    </> 
  );
};

export default Main;
