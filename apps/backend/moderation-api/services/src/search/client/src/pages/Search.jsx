import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";
import RestaurantList from "./RestaurantList";

const API_URL = "http://localhost:3000";
const USER_ID = 1;

function Search() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [searched, setSearched] = useState(false);
  const [sort, setSort] = useState("");
  const [savedIds, setSavedIds] = useState(new Set());
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/favorites/${USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        const ids = new Set(data.map((fav) => fav.restaurantId));
        setSavedIds(ids);
      })
      .catch((err) => console.error(err));
  }, []);

  function fetchRestaurants(query, selectedSort = sort) {
    let url = `${API_URL}/restaurants`;
    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (selectedSort) params.append("sort", selectedSort);
    if (params.toString()) url += `?${params.toString()}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(data);
        setSearched(true);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetchRestaurants("");
  }, []);

  function searchRestaurants(event) {
    event.preventDefault();
    fetchRestaurants(search.trim());
  }

  function clearSearch() {
    setSearch("");
    fetchRestaurants("");
  }

  async function toggleFavorite(restaurantId) {
    setSavingId(restaurantId);
    const isSaved = savedIds.has(restaurantId);

    if (isSaved) {
      const res = await fetch(`${API_URL}/favorites/${USER_ID}`);
      const favs = await res.json();
      const fav = favs.find((f) => f.restaurantId === restaurantId);
      if (fav) {
        await fetch(`${API_URL}/favorites/${fav.id}`, { method: "DELETE" });
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(restaurantId);
          return next;
        });
      }
    } else {
      await fetch(`${API_URL}/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, restaurantId }),
      });
      setSavedIds((prev) => new Set(prev).add(restaurantId));
    }

    setSavingId(null);
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>🍴 ForkRank</h2>
        <Link to="/favorites">My Favorites</Link>
      </div>

      <div className="search-area">
        <h1>Find a Restaurant</h1>
        <p>Search by restaurant name, cuisine, or food keyword.</p>

        <form onSubmit={searchRestaurants}>
          <input
            type="text"
            placeholder="Enter restaurant or keyword"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={clearSearch}>Clear</button>
        </form>

        <div className="sort-area">
          <label>Sort By: </label>
          <select
            value={sort}
            onChange={(event) => {
              const newSort = event.target.value;
              setSort(newSort);
              fetchRestaurants(search.trim(), newSort);
            }}
          >
            <option value="">Default</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      <div className="search-results">
        {!searched && (
          <p>Enter a restaurant name or keyword to start searching.</p>
        )}

        {searched && restaurants.length === 0 && (
          <p>No restaurants found. Try broadening your search.</p>
        )}

        {searched && restaurants.length > 0 && <h2>Search Results</h2>}

        <RestaurantList
	  restaurants={restaurants}
	  savedIds={savedIds}
	  savingId={savingId}
	  toggleFavorite={toggleFavorite}
	/>
     </div>
   </div>
 );
}

	
export default Search;
