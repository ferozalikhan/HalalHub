export function getZoomForModeOrDistance(searchMode, distance = 5) {
    if (searchMode === "nearby") {
      if (distance <= 1) return 16;
      if (distance <= 2) return 15;
      if (distance <= 5) return 14;
      if (distance <= 10) return 13;
      if (distance <= 15) return 12;
      if (distance <= 20) return 11;
  
      // Beyond this, user should manually zoom out
      return 10;
    }
  
    if (searchMode === "text") {
      return 13; // city view
    }
  
    if (searchMode === "drag") {
      return null; // never force-zoom in drag mode
    }
  
    return 13; // fallback
  }
  