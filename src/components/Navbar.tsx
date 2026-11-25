import "./Navbar.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">

    <div className = "nav-tabs">
        <NavLink to="/" end className="nav-logo">LA LP</NavLink>
      <NavLink to="/" end className="nav-link">Opportunities</NavLink>
      <NavLink to="/map" className="nav-link">Map</NavLink>
      <NavLink to="/saved" className="nav-link">Saved</NavLink>
      </div>
      {/* Sign-in placeholder*/}
      <div className="nav-account">
        <button className="nav-button">Sign in</button>
      </div>
    </nav>
  );
}