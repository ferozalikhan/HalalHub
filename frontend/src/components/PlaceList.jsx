// PlaceList.jsx - Fixed version to prevent nested <a> tags
import { calculateDistanceMiles } from '../utils/distance';

import { 
    FaStar, FaMapMarkerAlt, FaClock, FaUtensils, FaMotorcycle, FaShoppingBag, 
    FaPhoneAlt, FaGlobe 
  } from "react-icons/fa";
  import { Link } from "react-router-dom";
  import "../styles/PlaceList.css";
  
  // const getPhotoUrl = (photoRef) => `https://places.googleapis.com/v1/${photoRef.name}/media?maxWidthPx=400&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  
  const getPhotoUrl = (photo) =>
    `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=400&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
  
  const extractLocation = (formattedAddress) => {
    if (!formattedAddress) return "Location unavailable";
    const parts = formattedAddress.split(', ');
    return parts[1] || formattedAddress;
  };
  
  const getPlaceTypeInfo = (primaryType, types) => {
    const typeMapping = {
      'restaurant': { icon: <FaUtensils />, label: 'Restaurant' },
      'cafe': { icon: <FaUtensils />, label: 'Café' },
      'bakery': { icon: <FaUtensils />, label: 'Bakery' },
      'food': { icon: <FaUtensils />, label: 'Food Place' },
      'meal_takeaway': { icon: <FaShoppingBag />, label: 'Takeaway' },
      'meal_delivery': { icon: <FaMotorcycle />, label: 'Delivery' },
      'grocery_store': { icon: <FaShoppingBag />, label: 'Grocery' },
      'supermarket': { icon: <FaShoppingBag />, label: 'Supermarket' },
      'store': { icon: <FaShoppingBag />, label: 'Store' },
      'default': { icon: <FaUtensils />, label: 'Place' }
    };
    if (primaryType) {
      const normalized = primaryType.toLowerCase().replace(/_/g, '');
      for (const key in typeMapping) {
        if (normalized.includes(key)) return typeMapping[key];
      }
    }
    if (types?.length) {
      for (const type of types) {
        const normalized = type.toLowerCase().replace(/_/g, '');
        for (const key in typeMapping) {
          if (normalized.includes(key)) return typeMapping[key];
        }
      }
    }
    return typeMapping.default;
  };
  
  const getHalalVerification = (place, index) => {
    const options = ['certified', 'verified', 'community'];
    return options[index % options.length];
  };

  const formatOpeningHours = (regularOpeningHours) => {
    if (!regularOpeningHours?.weekdayDescriptions) return null;
  
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
    const todayDescription = regularOpeningHours.weekdayDescriptions[today];
  
    return todayDescription || null;
  };
  

  function getNeutralFallbackSummary(place, label) {
    const name = place.displayName?.text || "This place";
    const city = extractLocation(place.formattedAddress);
    return `${name} is a ${label.toLowerCase()} located in ${city}.`;
  }
  
  // Component for action buttons to avoid nesting <a> tags
  const ActionButton = ({ href, className, onClick, children }) => {
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (onClick) {
        onClick(e);
      } else if (href) {
        window.open(href, '_blank', 'noopener,noreferrer');
      }
    };
    
    return (
      <button
        className={className}
        onClick={handleClick}
        type="button"
      >
        {children}
      </button>
    );
  };
  
  export default function PlaceList({ places, userLocation, loading }) {
    if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Discovering halal places near you...</p></div>;
    if (!places || !places.length) return <div className="no-results">No halal places found. Try adjusting your search.</div>;
  
    // Handler for phone calls
    const handlePhoneClick = (phoneNumber, e) => {
      e.stopPropagation();
      window.location.href = `tel:${phoneNumber}`;
    };
    
    // Handler for external links
    const handleExternalLink = (url, e) => {
      e.stopPropagation();
      window.open(url, '_blank', 'noopener,noreferrer');
    };
  
    return (
      <div className="featured-grid">
        {places.map((place, index) => {
          const priceSymbols = place.priceLevel ? "$".repeat(place.priceLevel) : "$$";
          // if index is 0, 3 mark as open 
          let isOpen = place.currentOpeningHours?.openNow;
          // TODO: replace with actual image url later | this is good for testing | cost effective
          // const imageUrl = place.photos?.[0]?.name
          // ? getPhotoUrl(place.photos[0])
          // : 'https://placehold.co/400x200?text=Halal+Restaurant&font=roboto';
          const imageUrl = 'https://placehold.co/400x200?text=Halal+Restaurant&font=roboto';

          const distance = userLocation && place.location ? calculateDistanceMiles(userLocation.lat, userLocation.lng, place.location.latitude, place.location.longitude) : null;
          const location = extractLocation(place.formattedAddress);
          const { icon, label } = getPlaceTypeInfo(place.primaryType, place.types);
          const halalStatus = getHalalVerification(place, index);
          const todayHours = formatOpeningHours(place.regularOpeningHours);
          const summary =
          place.generativeSummary?.overview?.text ||
          place.editorialSummary?.text ||
          getNeutralFallbackSummary(place, label);
  
          return (
            <Link key={index} to={`/place/${place.id || index}`} className="place-card" aria-label={`View details for ${place.displayName?.text}`}>
              <div className={`place-card-img ${!imageUrl ? 'placeholder' : ''}`} style={imageUrl ? { backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
                {!imageUrl && <div className="place-img-placeholder"><div className="placeholder-icon">{icon}</div></div>}
              </div>
  
              <div className="place-card-content">
                <div className="place-card-header">
                  <h3 className="place-name">{place.displayName?.text || "Unknown Place"}</h3>
                </div>
  
                <div className="status-inline">
                  <span className="type-pill">{icon} {label}</span>
                  <span className={`halal-indicator halal-${halalStatus}`}>{halalStatus === 'certified' ? 'Halal Certified' : halalStatus === 'verified' ? 'Halal Verified' : 'Community Verified'}</span>
                  {isOpen !== undefined && <span className={`open-status ${isOpen ? 'is-open' : 'is-closed'}`}>{isOpen ? 'Open Now' : 'Closed'}</span>}
                </div>
  
                <div className="place-card-meta">
                  <div className="rating-price">
                    <div className="rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => <FaStar key={i} className={i < Math.round(place.rating || 0) ? "star filled" : "star"} />)}
                      </div>
                      <span className="rating-value">{place.rating || 'N/A'}</span>
                      <span className="rating-count">({place.userRatingCount || 0})</span>
                    </div>
                    <div className="price">{priceSymbols}</div>
                  </div>
  
                  <div className="location-distance">
                    <div className="location">
                      <FaMapMarkerAlt className="icon" />
                      <span className="truncate">{location}</span>
                    </div>
                    {distance && <div className="distance">{distance} mi</div>}
                  </div>
                </div>
  
                {todayHours && <div className="hours-info"><FaClock className="hours-icon" /><span className="hours-text">{todayHours}</span></div>}
                <div className="place-summary truncate-2">{summary}</div>
  
                <div className="contact-actions">
                  {place.nationalPhoneNumber && 
                    <ActionButton 
                      className="action-btn phone" 
                      onClick={(e) => handlePhoneClick(place.nationalPhoneNumber, e)}
                    >
                      <FaPhoneAlt /><span>Call</span>
                    </ActionButton>
                  }
                  
                  {place.websiteUri && 
                    <ActionButton 
                      className="action-btn website" 
                      onClick={(e) => handleExternalLink(place.websiteUri, e)}
                    >
                      <FaGlobe /><span>Website</span>
                    </ActionButton>
                  }
                  
                  {place.googleMapsUri && 
                    <ActionButton 
                      className="action-btn directions" 
                      onClick={(e) => handleExternalLink(place.googleMapsUri, e)}
                    >
                      <FaMapMarkerAlt /><span>Directions</span>
                    </ActionButton>
                  }
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }