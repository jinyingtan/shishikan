import React, { useState, useEffect, useContext, createContext } from 'react';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '@constants/google';

const GoogleMapsContext = createContext({
  isLoaded: null,
});

export function GoogleMapsProvider({ children, ...props }) {
  const [isMapsLoaded, setIsMapsLoaded] = useState(false);

  useEffect(() => {
    window.mapCallback = function () {
      setIsMapsLoaded(true);
    };
    const gmapScriptEl = document.createElement(`script`);
    gmapScriptEl.src = `${GOOGLE_PLACE_AUTOCOMPLETE_URL}&callback=mapCallback`;
    document.querySelector(`body`).insertAdjacentElement(`beforeend`, gmapScriptEl);
  }, []);

  return <GoogleMapsContext.Provider value={{ isLoaded: isMapsLoaded }}>{children}</GoogleMapsContext.Provider>;
}

export const useGoogleMaps = () => {
  return useContext(GoogleMapsContext);
};
