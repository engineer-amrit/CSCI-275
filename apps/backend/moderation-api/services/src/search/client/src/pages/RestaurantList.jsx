import "./RestaurantList.css";

function RestaurantList({
  restaurants,
  savedIds,
  savingId,
  toggleFavorite,
}) {
  return (
    <>
      {restaurants.map((restaurant) => {
        const isSaved = savedIds.has(restaurant.id);

        return (
          <div
            className="restaurant-card"
            key={restaurant.id}
          >
            <button
              className="favorite-button"
              onClick={() => toggleFavorite(restaurant.id)}
              disabled={savingId === restaurant.id}
              title={
                isSaved
                  ? "Remove from favorites"
                  : "Save to favorites"
              }
            >
              {isSaved ? "❤️" : "🤍"}
            </button>

            <h2>{restaurant.name}</h2>

            <p>
              <strong>Cuisine:</strong> {restaurant.cuisine}
            </p>

            <p>
              <strong>Price:</strong> {restaurant.price}
            </p>

            <p>
              <strong>Rating:</strong> {restaurant.rating} ⭐
            </p>

            <p>
              <strong>Location:</strong> {restaurant.location}
            </p>

            <p>{restaurant.description}</p>
          </div>
        );
      })}
    </>
  );
}

export default RestaurantList;
