import { useState, useContext } from "react";
import MovieModal from "./movieModal";
import MovieContext from "../context/movieContext";
import UserContext from "../context/userContext";

function MovieCard({ movie }) {
  const { movies, setMovies, deleteMovie } = useContext(MovieContext);
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const updateMovieComments = (movieId, newComment) => {
    const updatedMovies = movies.map((m) =>
      m._id === movieId ? { ...m, comments: [...m.comments, newComment] } : m
    );
    setMovies(updatedMovies);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      deleteMovie(movie._id);
    }
  };

  const handleSaveEdit = async (updatedFields) => {
    const API_URL = "https://movieapp-api-lms1.onrender.com";

    try {
      const response = await fetch(`${API_URL}/movies/updateMovie/${movie._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      if (!response.ok) throw new Error("Failed to update movie");

      const data = await response.json();
      const updatedMovie = data.updatedMovie;

      setMovies((prev) =>
        prev.map((m) => (m._id === movie._id ? updatedMovie : m))
      );

      alert("Movie updated successfully!");
    } catch (error) {
      console.error("Error updating movie:", error);
      alert("Error updating movie");
    } finally {
      setShowModal(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "15px",
          textAlign: "left",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>
          {movie.title} ({movie.year})
        </h2>
        <p>
          <strong>Director:</strong> {movie.director || "Unknown"}
        </p>
        <p>
          <strong>Genre:</strong> {movie.genre || "Unknown"}
        </p>
        <p>{movie.description || "No description available."}</p>

        {movie.comments?.length > 0 ? (
          <div>
            <strong>Comments:</strong>
            <ul>
              {movie.comments.map((c) => (
                <li key={c._id || c.comment}>
                  {c.comment} {c.userId ? `(by ${c.userId})` : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>
            <em>No comments yet.</em>
          </p>
        )}

        {user?.isAdmin && (
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                setIsEditing(true);
                setShowModal(true);
              }}
              style={{ marginRight: "5px" }}
            >
              Edit
            </button>
            <button onClick={handleDelete} style={{ marginRight: "5px" }}>
              Delete
            </button>
          </div>
        )}

        <button
          onClick={() => {
            setIsEditing(false);
            setShowModal(true);
          }}
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
          onClose={() => {
            setShowModal(false);
            setIsEditing(false);
          }}
          updateMovieComments={updateMovieComments}
          isEditing={isEditing}            // 👈 pass edit flag
          onSaveEdit={handleSaveEdit}      // 👈 handle save callback
        />
      )}
    </>
  );
}

export default MovieCard;
