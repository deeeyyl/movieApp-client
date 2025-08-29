import { useState, useContext } from "react";
import MovieContext from "../context/movieContext";
import UserContext from "../context/userContext";

function MovieModal({ movie, onClose }) {
  const { addComment, setMovies, movies } = useContext(MovieContext);
  const { user } = useContext(UserContext);

  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  // Editable movie details (only for admins)
  const [title, setTitle] = useState(movie.title);
  const [year, setYear] = useState(movie.year);
  const [director, setDirector] = useState(movie.director || "");
  const [genre, setGenre] = useState(movie.genre || "");
  const [description, setDescription] = useState(movie.description || "");

  const API_URL = "https://movieapp-api-lms1.onrender.com";

  // ✅ Add comment and update local state immediately
  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      const newComment = await addComment(movie._id, comment);
      setComment("");
      setError("");

      // update movie in context with new comment
      const updatedMovies = movies.map((m) =>
        m._id === movie._id
          ? { ...m, comments: [...(m.comments || []), newComment] }
          : m
      );
      setMovies(updatedMovies);
    } catch (err) {
      console.error("Failed to add comment:", err);
      setError(err.message || "Failed to add comment");
    }
  };

  // ✅ Save edit and update movies in context with backend response
  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/movies/updateMovie/${movie._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, year, director, genre, description }),
      });

      if (!response.ok) throw new Error("Failed to update movie");

      const updatedMovie = await response.json();
      console.log("Update response:", updatedMovie);

      // replace old movie with updated one
      const updatedMovies = movies.map((m) =>
        m._id === movie._id ? updatedMovie : m
      );
      setMovies(updatedMovies);

      alert("Movie updated successfully!");
    } catch (err) {
      console.error("Error updating movie:", err);
      alert("Error updating movie");
    }
  };

  if (!movie) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100%", height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white", padding: "20px",
        borderRadius: "10px",
        maxWidth: "500px", width: "90%",
        maxHeight: "80%", overflowY: "auto",
        position: "relative"
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "10px", right: "10px",
            background: "red", color: "white",
            border: "none", borderRadius: "5px",
            padding: "5px 10px", cursor: "pointer"
          }}
        >
          Close
        </button>

        {user?.isAdmin ? (
          <>
            <h2>Edit Movie</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
            <input value={director} onChange={(e) => setDirector(e.target.value)} placeholder="Director" />
            <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />

            <button onClick={handleSaveEdit} style={{
              marginTop: "10px",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "none",
              background: "#007bff",
              color: "white",
              cursor: "pointer"
            }}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h2>{movie.title} ({movie.year})</h2>
            <p><strong>Director:</strong> {movie.director || "Unknown"}</p>
            <p><strong>Genre:</strong> {movie.genre || "Unknown"}</p>
            <p>{movie.description || "No description available."}</p>
          </>
        )}

        {/* Comments */}
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

        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "70%", marginRight: "10px" }}
          />
          <button onClick={handleAddComment} style={{
            padding: "5px 10px",
            borderRadius: "5px",
            border: "none",
            background: "#28a745",
            color: "white",
            cursor: "pointer",
          }}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
