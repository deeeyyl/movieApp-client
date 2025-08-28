import { createContext, useState, useEffect } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch movies on mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/movies/getMovies`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch movies: ${res.status} - ${text}`);
        }

        const data = await res.json();

        // Ensure movies is always an array
        setMovies(Array.isArray(data) ? data : data.movies || []);
        setError("");
      } catch (err) {
        console.error("Error fetching movies:", err);
        setMovies([]); // fallback to empty array
        setError(err.message);
      }
    };

    fetchMovies();
  }, [API_URL]);

  const deleteMovie = (id) => {
    setMovies((prevMovies) => prevMovies.filter((m) => m._id !== id));
};

  const addComment = async (movieId, commentText) => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/movies/addComment/${movieId}`, {
      method: "PATCH", // PATCH since backend uses it
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ comment: commentText }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to add comment: ${res.status} - ${text}`);
    }

    const data = await res.json();

    // Ensure data.comment is valid
    const newComment = data.comment || {
      _id: Date.now().toString(),
      comment: commentText,
      userId: "currentUser",
    };

    setMovies(prev =>
      prev.map(movie =>
        movie._id === movieId
          ? { ...movie, comments: [...(movie.comments || []), newComment] }
          : movie
      )
    );

    return newComment;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw err;
  }
};

  // Add movie (for your MoviesPage add form)
  const addMovie = async (newMovie) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/movies/addMovie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newMovie),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to add movie: ${res.status} - ${text}`);
    }

    const savedMovie = await res.json();

    // Update local state with the saved movie
    setMovies((prev) => [...prev, savedMovie]);
  } catch (err) {
    console.error("Movie API error:", err);
    setError(err.message);
  }
};

  return (
    <MovieContext.Provider value={{ movies, setMovies, addComment, addMovie, error, deleteMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export default MovieContext;