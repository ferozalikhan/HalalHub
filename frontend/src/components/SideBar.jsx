import { useState } from 'react';
import '../styles/SideBar.css';
import { 
  FaFilter, 
  FaTimes, 
  FaStar, 
  FaUtensils, 
  FaTruck, 
  FaStore,  
  FaClock, 
  FaMotorcycle, 
  FaRegCalendarCheck, 
  FaPrayingHands,
  FaMapMarkerAlt,
  FaCertificate
} from 'react-icons/fa';
import { BiDish } from 'react-icons/bi';
import { MdOutlineDeliveryDining } from 'react-icons/md';

/**
 * SideBar Component for filtering options
 * @param {Object} props Component props
 * @param {boolean} props.toggleSidebar Controls sidebar visibility
 * @param {Function} props.manageSidebar Function to toggle sidebar
 * @param {Function} props.applyFilters Function to apply selected filters
 * @returns {JSX.Element} Rendered SideBar component
 */
export default function SideBar({ toggleSidebar, manageSidebar, applyFilters }) {
  // State to manage all filter selections
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    cuisine: [],
    price: [],
    rating: null,
    features: [],
    certification: [],
    distance: 5
  });

  /**
   * Handle checkbox selection changes
   * @param {string} filterType The filter category
   * @param {string|number} value The filter value
   */
  const handleCheckboxChange = (filterType, value) => {
    setSelectedFilters(prev => {
      // For rating, allow only one selection
      if (filterType === 'rating') {
        return {
          ...prev,
          rating: prev.rating === value ? null : value
        };
      }
      
      // For other filter types, toggle the selection
      const isSelected = prev[filterType].includes(value);
      return {
        ...prev,
        [filterType]: isSelected
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value]
      };
    });
  };

  /**
   * Handle distance slider changes
   * @param {Event} e Change event
   */
  const handleDistanceChange = (e) => {
    setSelectedFilters(prev => ({
      ...prev,
      distance: parseInt(e.target.value, 10)
    }));
  };

  /**
   * Reset all filters to default values
   */
  const resetFilters = () => {
    setSelectedFilters({
      category: [],
      cuisine: [],
      price: [],
      rating: null,
      features: [],
      certification: [],
      distance: 5
    });
  };

  /**
   * Apply current filters and notify parent component
   */
  const handleApplyFilters = () => {
    if (typeof applyFilters === 'function') {
      applyFilters(selectedFilters);
    }
  };

  // Filter sections configuration to make code more maintainable
  const cuisineOptions = [
    { id: 'middle-eastern', label: 'Middle Eastern' },
    { id: 'south-asian', label: 'South Asian' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'american', label: 'American' },
    { id: 'turkish', label: 'Turkish' }
  ];

  const featureOptions = [
    { id: 'open-now', label: 'Open Now', icon: FaClock },
    { id: 'delivery', label: 'Delivery Available', icon: MdOutlineDeliveryDining },
    { id: 'takeout', label: 'Takeout Available', icon: FaMotorcycle },
    { id: 'reservation', label: 'Reservations', icon: FaRegCalendarCheck },
    { id: 'prayer-room', label: 'Prayer Room', icon: FaPrayingHands }
  ];

  const categoryOptions = [
    { id: 'restaurants', label: 'Halal Restaurants', icon: FaUtensils },
    { id: 'foodtrucks', label: 'Halal Food Trucks', icon: FaTruck },
    { id: 'grocery', label: 'Halal Grocery Stores', icon: FaStore }
  ];

  const certificationOptions = [
    { id: 'verified', label: 'Officially Certified', icon: FaCertificate },
    { id: 'community', label: 'Community Certified', icon: FaCertificate }
  ];

  return (
    <aside className={`sidebar ${toggleSidebar ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <h1><FaFilter className="filter-icon-header" /> Filters</h1>
        <button 
          className="close-btn" 
          onClick={manageSidebar}
          aria-label="Close filters"
        >
          <FaTimes />
        </button>  
      </div>

      {/* Category filter */}
      <div className="filter-group">
        <h3 className="filter-title">Category</h3>
        <ul className="filter-list">
          {categoryOptions.map(category => (
            <li key={category.id} className="filter-item">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={selectedFilters.category.includes(category.id)}
                  onChange={() => handleCheckboxChange('category', category.id)}
                />
                <category.icon className="filter-icon" />
                <span>{category.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Distance filter */}
      <div className="filter-group">
        <h3 className="filter-title">
          <FaMapMarkerAlt className="filter-icon" />
          <span>Distance</span>
        </h3>
        <div className="distance-slider-container">
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={selectedFilters.distance}
            onChange={handleDistanceChange}
            className="distance-slider"
            aria-label="Distance in miles"
          />
          <div className="distance-value">
            <span>{selectedFilters.distance} miles</span>
          </div>
        </div>
      </div>
      
      {/* Certification filter */}
      <div className="filter-group">
        <h3 className="filter-title">Certification</h3>
        <ul className="filter-list">
          {certificationOptions.map(cert => (
            <li key={cert.id} className="filter-item">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={selectedFilters.certification.includes(cert.id)}
                  onChange={() => handleCheckboxChange('certification', cert.id)}
                />
                <cert.icon className="filter-icon" />
                <span>{cert.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rating filter */}
      <div className="filter-group">
        <h3 className="filter-title">Rating</h3>
        <ul className="filter-list">
          {[5, 4, 3].map((stars) => (
            <li key={stars} className="filter-item">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={selectedFilters.rating === stars}
                  onChange={() => handleCheckboxChange('rating', stars)}
                />
                <div className="stars-container">
                  {Array.from({ length: stars }).map((_, i) => (
                    <FaStar key={i} className="star-icon filled" />
                  ))}
                  {Array.from({ length: 5 - stars }).map((_, i) => (
                    <FaStar key={i} className="star-icon" />
                  ))}
                </div>
                <span className="rating-label">{stars}+ Stars</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price filter */}
      <div className="filter-group">
        <h3 className="filter-title">Price</h3>
        <div className="price-filter-row">
          {['$', '$$', '$$$'].map(price => (
            <button 
              key={price}
              className={`price-button ${selectedFilters.price.includes(price) ? 'active' : ''}`}
              onClick={() => handleCheckboxChange('price', price)}
              aria-pressed={selectedFilters.price.includes(price)}
              aria-label={`Price level ${price}`}
            >
              {price}
            </button>
          ))}
        </div>
        <div className="price-labels-row">
          <span>Budget</span>
          <span>Moderate</span>
          <span>Premium</span>
        </div>
      </div>
      
      {/* Cuisine filter */}
      <div className="filter-group">
        <h3 className="filter-title">Cuisine</h3>
        <ul className="filter-list">
          {cuisineOptions.map(cuisine => (
            <li key={cuisine.id} className="filter-item">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={selectedFilters.cuisine.includes(cuisine.id)}
                  onChange={() => handleCheckboxChange('cuisine', cuisine.id)}
                />
                <BiDish className="filter-icon" />
                <span>{cuisine.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Features filter */}
      <div className="filter-group">
        <h3 className="filter-title">Features</h3>
        <ul className="filter-list">
          {featureOptions.map(feature => (
            <li key={feature.id} className="filter-item">
              <label className="filter-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={selectedFilters.features.includes(feature.id)}
                  onChange={() => handleCheckboxChange('features', feature.id)}
                />
                <feature.icon className="filter-icon" />
                <span>{feature.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Action Buttons */}
      <div className="filter-actions">
        <button 
          className="btn btn-primary apply-filters" 
          onClick={handleApplyFilters}
        >
          Apply Filters
        </button>
        <button 
          className="btn btn-secondary reset-filters" 
          onClick={resetFilters}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
}