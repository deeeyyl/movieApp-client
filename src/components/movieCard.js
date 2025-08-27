import { useState, useContext } from "react";
import MovieModal from "./movieModal";
import MovieContext from "../context/movieContext";

function MovieCard({ movie }) {
  const [showModal, setShowModal] = useState(false);
  const { movies, setMovies } = useContext(MovieContext); // we'll need to add setMovies to context

  const updateMovieComments = (movieId, newComment) => {
    const updatedMovies = movies.map((m) => {
      if (m._id === movieId) {
        return { ...m, comments: [...m.comments, newComment] };
      }
      return m;
    });
    setMovies(updatedMovies);
  };

  return (
    <>
      <div style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "15px",
        textAlign: "left",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}>
        <h2>{movie.title} ({movie.year})</h2>
        <p><strong>Director:</strong> {movie.director || "Unknown"}</p>
        <p><strong>Genre:</strong> {movie.genre || "Unknown"}</p>
        <p>{movie.description || "No description available."}</p>

        {movie.comments && movie.comments.length > 0 ? (
          <div>
            <strong>Comments:</strong>
            <ul>
              {movie.comments.map((c) => (
                <li key={c._id}>
                  {c.comment} {c.userId ? `(by ${c.userId})` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p><em>No comments yet.</em></p>
        )}

        <button
          onClick={() => setShowModal(true)}
          style={{
            marginTop: "10px",
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          View Movie
        </button>
      </div>

      {showModal && (
        <MovieModal
          movie={movie}
          onClose={() => setShowModal(false)}
          updateMovieComments={updateMovieComments}
        />
      )}
    </>
  );
}

export default MovieCard;