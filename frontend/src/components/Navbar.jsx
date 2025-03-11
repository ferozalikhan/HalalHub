import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Search, MapPin } from 'lucide-react';
import '../styles/Navbar.css';

export default function Navbar({ toggleSidebarHandler }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dropdownRef = useRef(null);
  const selectedOptionsRef = useRef(null);
  
  // Function to toggle a category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  // Helper function to get display labels for categories
  const getCategoryLabel = (category) => {
    const labels = {
      restaurants: 'Halal Restaurants',
      foodtrucks: 'Food Trucks',
      groceries: 'Grocery Stores',
      // Add more categories here
    };
    return labels[category] || category;
  };
  
  // Remove a selected category
  const removeCategory = (category) => {
    setSelectedCategories(selectedCategories.filter(c => c !== category));
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // This function determines what to display in the search box
  const renderSearchDisplay = () => {
    const maxVisibleTags = 2; // Maximum number of tags to display before showing a counter
    
    if (selectedCategories.length === 0) {
      return (
        <input 
          type="text"
          className="multiselect-input"
          placeholder="Halal Restaurants, Food Trucks..."
          readOnly
        />
      );
    }
    
    // If we have a reasonable number of tags, display them all
    if (selectedCategories.length <= maxVisibleTags) {
      return (
        <div className="selected-options" ref={selectedOptionsRef}>
          {selectedCategories.map((category) => (
            <span key={category} className="selected-tag">
              {getCategoryLabel(category)}
              <span 
                className="tag-remove" 
                onClick={(e) => {
                  e.stopPropagation();
                  removeCategory(category);
                }}
              >
                ×
              </span>
            </span>
          ))}
        </div>
      );
    } 
    
    // If we have too many tags, show a subset with a count indicator
    return (
      <div className="selected-options" ref={selectedOptionsRef}>
        {selectedCategories.slice(0, maxVisibleTags).map((category) => (
          <span key={category} className="selected-tag">
            {getCategoryLabel(category)}
            <span 
              className="tag-remove" 
              onClick={(e) => {
                e.stopPropagation();
                removeCategory(category);
              }}
            >
              ×
            </span>
          </span>
        ))}
        <span className="tag-counter">+{selectedCategories.length - maxVisibleTags} </span>
      </div>
    );
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Hamburger menu button */}
        <button className="menu-btn" onClick={toggleSidebarHandler}>
          ☰
        </button>
        
        {/* Brand/Logo */}
        <a href="/" className="navbar-brand">
          <h1 className="navbar-logo">Halal Hub</h1>
        </a>

        {/* Search Bar */}
        <div className="navbar-search">

          <div className="search-wrapper">
            
            <div className="navbar-search-group">
              <Search className="search-icon" size={20} />
              <div className="custom-multiselect" ref={dropdownRef}>
                <div 
                  className="multiselect-display search-input"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {renderSearchDisplay()}
                  <ChevronDown 
                    size={16} 
                    className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  />
                </div>
                
                {dropdownOpen && (
                  <div className="dropdown-options">
                    {['restaurants', 'foodtrucks', 'groceries'].map((category) => (
                      <div 
                        key={category}
                        className={`option ${selectedCategories.includes(category) ? 'selected' : ''}`} 
                        onClick={() => toggleCategory(category)}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(category)} 
                          readOnly 
                        />
                        <span>{getCategoryLabel(category)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="navbar-search-group location-group">
              <MapPin className="location-icon" size={20} />
              <input 
                type="text" 
                className="search-input location-input"
                placeholder="Location"
              />
            </div>
          </div>
        </div>
        
        {/* Nav Links */}
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