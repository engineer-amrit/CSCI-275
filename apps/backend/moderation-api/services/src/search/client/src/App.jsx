import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Favorites from "./pages/Favorites";
import Search from "./pages/Search";

function Home() {
  return (
    <div style={{ padding: "24px" }}>
      <h1>🍦 ForkRank</h1>
      <p>Restaurant Discovery App</p>
      <nav>
        <Link to="/favorites" style={{ marginRight: "16px" }}>My Favorites</Link>
        <Link to="/search">Search</Link>
      </nav>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;