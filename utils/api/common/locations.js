import axios from 'axios';
import { GEO_LOCATION_URL } from '@constants/thirdPartyAPIUrl';
import LocationsError from '../error/locationsError';

export const getLocationInfos = async (locations) => {
  const locationInfos = [];

  const locationPromises = locations.map((location) => {
    return axios.get(`${GEO_LOCATION_URL}&address=${location}`);
  });

  try {
    const results = await Promise.all(locationPromises);

    for (let i = 0; i < results.length; i++) {
      if (results[i].status != 200) {
        continue;
      }
      if (results[i].data.status !== 'OK') {
        continue;
      }

      const fullAddress = results[i].data.results[0]['formatted_address'];
      const lat = results[i].data.results[0]['geometry']['location']['lat'];
      const long = results[i].data.results[0]['geometry']['location']['lng'];

      const locationInfo = {
        name: locations[i],
        fullAddress: fullAddress,
        lat: lat,
        lng: long,
      };

      const geoCodeAddressComponent = results[i].data.results[0]['address_components'];
      const hasPostalCode = geoCodeAddressComponent[geoCodeAddressComponent.length - 1]['types'][0] === 'postal_code';
      if (hasPostalCode) {
        const postalCode = geoCodeAddressComponent[geoCodeAddressComponent.length - 1]['long_name'];
        locationInfo['postalCode'] = postalCode;
      }

      locationInfos.push(locationInfo);
    }
  } catch (error) {
    throw new LocationsError('invalid-location', 'failed to fetch info for some locations');
  }

  return locationInfos;
};

export const getUpdatedLocations = async (currentLocations, updatedLocations) => {
  const locations = [];
  const newLocationsToQuery = [];

  for (const location of updatedLocations) {
    const locationInfo = currentLocations.find((currentLocation) => currentLocation.name === location);
    if (locationInfo === undefined) {
      newLocationsToQuery.push(location);
    } else {
      locations.push(locationInfo);
    }
  }

  const newLocations = await getLocationInfos(newLocationsToQuery);
  return [...locations, ...newLocations];
};
