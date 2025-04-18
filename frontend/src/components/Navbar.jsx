import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Search, MapPin } from 'lucide-react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import '../styles/Navbar.css';

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

export default function Navbar(
  { 
    toggleSidebarHandler,
     selectedPlace,
      setSelectedPlace,
      searchMode,
       setSearchMode,
       } )  {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  // set manual input to the selected place's formatted address
  const [manualInput, setManualInput] = useState("");
  


  // Refs for the dropdown and selected options
  const dropdownRef = useRef(null);
  const selectedOptionsRef = useRef(null);
  const inputRef = useRef(null);

  // Use the Maps library to get the user's location
  const places = useMapsLibrary("places"); // Get the Places library from the Maps API

  useEffect(() => {
    if (selectedPlace.formattedAddress) {
      setManualInput(selectedPlace.formattedAddress);
    }
  }, [selectedPlace.formattedAddress]);
  
      
  useEffect(() => {
    if (!places || !inputRef.current) return;

    // set the options for the autocomplete so it uses less data
    const options = {
      fields: ["geometry", "name", "formatted_address", "address_components"],
      types: ["geocode"],
      componentRestrictions: { country : "us" },
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));

    return () => {
      if (placeAutocomplete) {
        placeAutocomplete.unbindAll();
      }
    }

  }, [places]);


  const updateSelectedPlace = (newPlace) => {
    setSelectedPlace((prev) => {
      if (
        prev.name === newPlace.name &&
        prev.formattedAddress === newPlace.formattedAddress &&
        prev.latitude === newPlace.latitude &&
        prev.longitude === newPlace.longitude
      ) {
        return prev; // no changes
      }
      return newPlace;
    });
  };

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();
    if (!place.geometry) {
      console.error("Place does not have geometry");
      return;
    }

    // !! Debugging: Log the place object
    console.log("Place changed:", place);

    // const addressComponents = place.address_components;
    // const city = addressComponents[0]?.long_name;
    // const state = addressComponents[2]?.short_name;
    // const country = addressComponents[3]?.short_name;
    // const formattedAddress = `${city}, ${state}, ${country}`;

    if (!place?.address_components) return;
    console.log("Address components:", place.address_components);

    let city = "";
    let state = "";
    let country = ""; 

    const addressComponents = place?.address_components || [];
    for (const component of addressComponents) {
      if (component.types.includes("locality")) {
        city = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      } else if (component.types.includes("country")) {
        country = component.short_name;
      }
    }
    // !! Debugging: Log the extracted city, state, and country
    console.log("Extracted components:");
    console.log("City:", city);
    console.log("State:", state);
    console.log("Country:", country);
    
    const formattedAddress = [city, state, country].filter(Boolean).join(", ");
    // !! Debugging: Log the formatted address
    console.log("Formatted address:", formattedAddress);
    updateSelectedPlace({
      name: city,
      formattedAddress,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    });
    setManualInput(formattedAddress);
    // first check if search mode is not equal to "text"
    if (searchMode !== "text") {
      setSearchMode("text");
    }
  });
  }, [placeAutocomplete]);
  
  // Function to toggle a category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
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
                  aria-expanded={dropdownOpen} // ARIA attribute to indicate the dropdown state.
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
                ref={inputRef}
                className="search-input location-input"
                placeholder="Location"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
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