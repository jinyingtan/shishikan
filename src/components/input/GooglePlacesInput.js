import React, { useState, useEffect, useRef } from 'react';
import { Input, FormControl, FormLabel, FormErrorMessage, FormHelperText } from '@chakra-ui/react';
import { GOOGLE_PLACE_AUTOCOMPLETE_URL } from '@constants/google';

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};

const unloadScript = () => {
  const allScripts = document.getElementsByTagName('script');
  [].filter.call(allScripts, (scpt) => scpt.src.indexOf('libraries=places') >= 0)[0].remove();

  window.google = {};
};

/**
 * The field that has google places auto complete.
 * @param {string} label is the label of the InputField
 * @param {boolean} storeLocally is to set if the location is stored locally on device
 * @param {string} help is the help label of the InputField
 * @param {string} storageKey is the key to storeLocally using localStorage
 * @param {function} onChange is the function called whenever the field changes
 * @param {string} error is the error for the field
 * @param {boolean} disabled is to disable the field
 */
const GooglePlacesAutoCompleteField = ({ label, help, onChange, error, disabled, required }) => {
  const autoCompleteRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadScript(GOOGLE_PLACE_AUTOCOMPLETE_URL, () => handleScriptLoad(setQuery, autoCompleteRef));

    return function cleanup() {
      unloadScript();
    };
  }, []);

  const handleScriptLoad = (updateQuery, autoCompleteRef) => {
    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current);
    autoComplete.setFields(['address_components', 'formatted_address']);
    autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery));
  };

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = autoComplete.getPlace();
    const { formatted_address } = addressObject;
    updateQuery(formatted_address);
    onChange(formatted_address);
  };

  return (
    <FormControl isDisabled={disabled} isInvalid={error} isRequired={required}>
      <FormLabel>{label}</FormLabel>
      <Input
        ref={autoCompleteRef}
        placeholder=""
        id="googlePlaces"
        onChange={(event) => {
          if (event.target.value.length === 0) {
            onChange('');
          }
          setQuery(event.target.value);
        }}
        value={query}
      />
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  );
};

export default GooglePlacesAutoCompleteField;
