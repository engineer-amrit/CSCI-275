import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const styles = {
  page: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "24px",
    color: "#1a1a1a",
  },
  emptyState: {
    textAlign: "center",
    color: "#888",
    fontSize: "16px",
    marginTop: "48px",
  },
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  },
  restaurantName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#1a1a1a",
  },
  detail: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "4px",
  },
  removeButton: {
    marginTop: "12px",
    backgroundColor: "#e53935",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  spinner: {
    textAlign: "center",
    marginTop: "48px",
    fontSize: "16px",
    color: "#888",
  },
  backLink: {
    display: "inline-block",
    marginBottom: "16px",
    color: "#8B4513",
    textDecoration: "none",
  },
};

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1;

  useEffect(() => {
    fetch(`http://localhost:3000/favorites/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  function removeFavorite(favoriteId) {
    if (!window.confirm("Remove this restaurant from your favorites?")) return;
    fetch(`http://localhost:3000/favorites/${favoriteId}`, {
      method: "DELETE",
    })
      .then(() => {
        setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      })
      .catch((err) => console.error(err));
  }

  if (loading) {
    return (
      <div style={styles.spinner}>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={styles.page}>
        <Link to="/" style={styles.backLink}>← Back to Search</Link>
        <h1 style={styles.title}>My Favorites</h1>
        <p style={styles.emptyState}>You have no saved restaurants yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.backLink}>← Back to Search</Link>
      <h1 style={styles.title}>My Favorites</h1>
      {favorites.map((fav) => (
        <div key={fav.id} style={styles.card}>
          <p style={styles.restaurantName}>{fav.restaurant.name}</p>
          <p style={styles.detail}>🍽️ {fav.restaurant.cuisine}</p>
          <p style={styles.detail}>💰 {fav.restaurant.price}</p>
          <p style={styles.detail}>⭐ {fav.restaurant.rating}</p>
          <p style={styles.detail}>📍 {fav.restaurant.location}</p>
          <button
            style={styles.removeButton}
            onClick={() => removeFavorite(fav.id)}
          >
            Remove from Favorites
          </button>
        </div>
      ))}
    </div>
  );
}

export default Favorites;