import { useState, useContext } from "react";
import MovieContext from "../context/movieContext";

function MovieModal({ movie, onClose }) {
  const { updateMovieComments } = useContext(MovieContext); // use context directly
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      userId: "currentUser",
      comment: comment.trim(),
    };

    updateMovieComments(movie._id, newComment);
    setComment("");
  };

  if (!movie) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "500px",
        width: "90%",
        maxHeight: "80%",
        overflowY: "auto",
        position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "5px 10px",
            cursor: "pointer"
          }}
        >
          Close
        </button>

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