import React from "react";
import PropTypes from "prop-types";
// import '../Components/styles/card.css'

// Card component to display each movie's information

const Card = ({ info, onClick, toggleFavorite, isFavorite }) => {
  const img_path = "https://image.tmdb.org/t/p/w500";

  return (

    <div className="movie" onClick={() => onClick(info)}>
    
       {/* Movie Poster */}
      
      <img 
      src={img_path + info.poster_path} 
      className="poster" 
      alt={info.title} 
      />

      <div className="movie-details">
        <div className="box">
          <h4 className="title">{info.title}</h4>          {/* Movie title */}
          <p className="rating">{info.vote_average}</p>    {/* Movie rating */}
        </div>

          {/* Favorite button to add or remove the movie from favorites */}

        <button className="favorite-btn" onClick={(e) => {
          e.stopPropagation();        // Prevent triggering the onClick event of the movie
          toggleFavorite(info);      /// Calls the function to add/remove movie from favorites
        }}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}      {/* Button text based on favorite status */}
        </button>
      </div>
    </div>
  );
};

// Specifies the types of the props the Card component accepts

Card.propTypes = {
  info: PropTypes.shape({
    title: PropTypes.string.isRequired,
    vote_average: PropTypes.number.isRequired,
    poster_path: PropTypes.string.isRequired,
    overview: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  toggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default Card;
