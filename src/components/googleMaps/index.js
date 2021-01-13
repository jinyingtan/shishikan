import React, { useState, useEffect, useContext, createContext } from 'react';

const GoogleMapsContext = createContext({
  isLoaded: null,
});

export function GoogleMapsProvider({ children, ...props }) {
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  useEffect(() => {
    window.mapCallback = function () {
      setIsMapsLoaded(true);
    };
  }, []);

  return <GoogleMapsContext.Provider value={{ isLoaded: isMapsLoaded }}>{children}</GoogleMapsContext.Provider>;
}

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};
