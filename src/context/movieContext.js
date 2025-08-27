import { createContext, useState, useEffect } from "react";
import { api } from "../api";

const MovieContext = createContext();

export function MovieProvider({ children }) {
    const [movies, setMovies] = useState([]);

    const loadMovies = async () => {
        try {
            const data = await api("/movies/getMovies");
            setMovies(data.movies || []);
        } catch (err) {
            console.error(err);
            setMovies([]);
        }
    };

    const addMovie = async (movie) => {
        try {
            const response = await api("/movies/addMovie", "POST", movie);
            await loadMovies();
        } catch (err) {
            console.error("Error adding movie:", err);
            throw new Error("Failed to add movie. Server returned 500.");
        }
    };

    const updateMovieComments = (movieId, newComment) => {
        setMovies((prev) =>
            prev.map((m) =>
            m._id === movieId
                ? { ...m, comments: [...(m.comments || []), newComment] }
                : m
            )
        );
    };

  useEffect(() => {
    loadMovies();
  }, []);

  return (
    <MovieContext.Provider value={{ movies, setMovies, loadMovies, addMovie, updateMovieComments }}>
      {children}
    </MovieContext.Provider>
  );
}

export default MovieContext;