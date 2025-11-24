import React, { useState, useEffect } from "react";

export default function LocationSelector() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [countryError, setCountryError] = useState("");

  // Fetch countries on mount
  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch("https://location-selector.labs.crio.do/countries");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setCountryError("Failed to load countries. Please try again.");
        setCountries([]);
      }
    }
    fetchCountries();
  }, []);

  // Handle country selection
  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedCity("");
    setStates([]);
    setCities([]);

    try {
      const res = await fetch(`https://location-selector.labs.crio.do/country=${country}/states`);
      if (!res.ok) throw new Error("Failed to fetch states");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      setStates([]);
    }
  };

  // Handle state selection
  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity("");
    setCities([]);

    try {
      const res = await fetch(`https://location-selector.labs.crio.do/country=${selectedCountry}/state=${state}/cities`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      const data = await res.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  };

  // Handle city selection
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div>
      {countryError && <p style={{ color: "red" }}>{countryError}</p>}

      <select value={selectedCountry} onChange={handleCountryChange} disabled={!!countryError}>
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