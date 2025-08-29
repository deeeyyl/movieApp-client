import { createContext, useState, useEffect } from "react";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

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

        setMovies(Array.isArray(data) ? data : data.movies || []);
        setError("");
      } catch (err) {
        console.error("Error fetching movies:", err);
        setMovies([]);
        setError(err.message);
      }
    };

    fetchMovies();
  }, [API_URL]);

  const deleteMovie = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/movies/deleteMovie/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to delete movie: ${res.status} - ${text}`);
    }

    // Remove movie from local state
    setMovies((prevMovies) => prevMovies.filter((m) => m._id !== id));
  } catch (err) {
    console.error("Error deleting movie:", err);
    setError(err.message);
  }
};

  const addComment = async (movieId, commentText) => {
    try {
      const res = await fetch(`${API_URL}/movies/addComment/${movieId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ comment: commentText }) // ✅ correct key
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to add comment");
      }

      const data = await res.json();
      console.log("Response from backend:", data);

      if (!data.updatedMovie) {
        throw new Error("Backend did not return updated movie");
      }

      const updatedMovie = data.updatedMovie;

      setMovies((prev) =>
        prev.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        )
      );

      return updatedMovie.comments[updatedMovie.comments.length - 1];
    } catch (err) {
      throw err;
    }
  };

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