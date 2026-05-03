import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState(() => {
    try {
      const saved = window.localStorage.getItem('votewise_location');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location) {
      window.localStorage.setItem('votewise_location', JSON.stringify(location));
    }
  }, [location]);

  const requestLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using OpenStreetMap Nominatim API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          
          let locName = 'Unknown Location';
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const state = data.address.state;
            if (city && state) locName = `${city}, ${state}`;
            else if (city) locName = city;
            else if (state) locName = state;
            else locName = data.display_name.split(',').slice(0, 2).join(',');
          }
          
          setLocation(locName);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch location name.");
          setLocation("Location Found (Unknown City)");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        setError("Location permission denied or unavailable.");
        setIsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 }
    );
  };

  return { location, isLoading, error, requestLocation };
};
