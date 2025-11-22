import React, { useState, useEffect } from "react";

export default function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Step 3: Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      const res = await fetch("https://location-selector.labs.crio.do/countries");
      const data = await res.json();
      setCountries(data);
    }
    fetchCountries();
  }, []);

  // Step 4: Handle country selection
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    const res = await fetch(`https://location-selector.labs.crio.do/country=${country}/states`);
    const data = await res.json();
    setStates(data);
  };

  // Step 5: Handle state selection
  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    const res = await fetch(`https://location-selector.labs.crio.do/country=${selectedCountry}/state=${state}/cities`);
    const data = await res.json();
    setCities(data);
  };

  // Step 6: Handle city selection
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      <select value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Select Country</option>
        {countries.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
        <option value="">Select State</option>
        {states.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>

      {selectedCity && (
        <p>You selected {selectedCity}, {selectedState}, {selectedCountry}</p>
      )}
    </div>
  );
}