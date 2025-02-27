import { Search, MapPin } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand/Logo */}
        <a href="/" className="navbar-brand">
          <h1 className="navbar-logo">Halal Hub</h1>
        </a>

        {/* Search Bar */}
        <div className="navbar-search">
            <div className="navbar-search-group">
            <Search className="search-icon" size={20} />
            <input
             type="text" 
             className="search-input"
            placeholder = 'Halal Restaurants, Food Trucks, Grocery Stores...'
             />
            </div>

            <div className="navbar-search-group">
             <MapPin className="location-icon"  size={20} />
            <input type="text" 
             className="search-input"
             placeholder='Location'
             />
             </div>
            
           
        </div>
        

        <ul className="navbar-links">
          <li><a href="#">Discover</a></li>
          <li><a href="#">Favorites</a></li>
          <li><a href="#">Travel Mode</a></li>
        </ul>


        {/* Auth Buttons */}
        <div className="navbar-auth">
            
          <button className="btn-login">Log in</button>
          <button className="btn-signup">Sign up</button>
        </div>
      </div>
    </nav>
  );
}