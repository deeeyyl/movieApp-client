import { useContext, useState } from "react";
import MovieContext from "../context/movieContext";
import MovieCard from "../components/movieCard";

function MoviesPage() {
  const { movies, addMovie } = useContext(MovieContext);

  const [form, setForm] = useState({
    title: "",
    year: "",
    director: "",
    description: "",
    genre: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || isNaN(form.year) || Number(form.year) < 1888) {
      setError("Please enter a valid title and year.");
      return;
    }

    const newMovie = {
      _id: Date.now().toString(),
      title: form.title.trim(),
      year: Number(form.year),
      director: form.director.trim() || "Unknown",
      description: form.description.trim() || "No description yet.",
      genre: form.genre.trim() || "Unknown",
      comments: [], // start with empty comments
    };

    try {
      await addMovie(newMovie);
      setForm({ title: "", year: "", director: "", description: "", genre: "" });
    } catch (err) {
      console.error("Movie API error:", err);
      setError("Failed to add movie. Please try again later.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎬 Movie List</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          style={{ marginRight: "10px", marginBottom: "5px" }}
          required
        />
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          style={{ marginRight: "10px", marginBottom: "5px" }}
          required
        />
        <input
          type="text"
          name="director"
          placeholder="Director"
          value={form.director}
          onChange={handleChange}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ marginRight: "10px", marginBottom: "5px" }}
        />
        <br />
        <button type="submit">Add Movie</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div>
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MoviesPage;