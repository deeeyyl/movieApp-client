import { useState, useContext } from "react";
import MovieModal from "./movieModal";
import MovieContext from "../context/movieContext";
import UserContext from "../context/userContext";

function MovieCard({ movie }) {
  const { movies, setMovies, deleteMovie } = useContext(MovieContext);
  const { user } = useContext(UserContext); // to check admin
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);

  const updateMovieComments = (movieId, newComment) => {
    const updatedMovies = movies.map((m) => {
      if (m._id === movieId) {
        return { ...m, comments: [...m.comments, newComment] };
      }
      return m;
    });
    setMovies(updatedMovies);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      deleteMovie(movie._id);
    }
  };

  const handleEdit = (updatedMovie) => {
    const updatedMovies = movies.map((m) => (m._id === movie._id ? updatedMovie : m));
    setMovies(updatedMovies);
    setEditing(false);
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

        {user?.isAdmin && (
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setEditing(true)} style={{ marginRight: "5px" }}>Edit</button>
            <button onClick={handleDelete} style={{ marginRight: "5px" }}>Delete</button>
          </div>
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

      {editing && (
        <MovieModal
          movie={movie}
          onClose={() => setEditing(false)}
          onSave={handleEdit} // call when saving edits
        />
      )}
    </>
  );
}

export default MovieCard;