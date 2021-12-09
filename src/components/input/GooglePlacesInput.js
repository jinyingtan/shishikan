import React, { useState, useEffect, useRef } from 'react';
import { Input, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useGoogleMaps } from '@components/googleMaps';

let autoComplete;

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
const GooglePlacesAutoCompleteField = ({ label, help, onChange, error, disabled, required, value }) => {
  const autoCompleteRef = useRef(null);
  const [query, setQuery] = useState('');
  const googleMaps = useGoogleMaps();

  const handlePlaceSelect = async (updateQuery) => {
    const addressObject = autoComplete.getPlace();
    const { formatted_address } = addressObject;
    updateQuery(formatted_address);
    onChange(formatted_address);
  };

  useEffect(() => {
    if (googleMaps.isLoaded) {
      autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current);
      autoComplete.setFields(['address_components', 'formatted_address']);
      autoComplete.addListener('place_changed', () => handlePlaceSelect(setQuery));
    }
  }, [googleMaps]);

  useEffect(() => {
    if (value) {
      setQuery(value);
    }
  }, [value]);

  return (
    <>
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
    </>
  );
};

export default GooglePlacesAutoCompleteField;
