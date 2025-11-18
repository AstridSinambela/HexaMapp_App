<script>
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";
  import CountrySidebar from "$lib/components/CountrySidebar.svelte";
  import CountrySearch from '$lib/components/CountrySearch.svelte';

  export let data;

  let map;
  let selectedCountry = null;
  let countryLayers = {};
  let selectedCountries = [];
  let userEmail = "alexaazkanio@gmail.com";
  let allCountries = data.countries;
 
  const selectCountryFromList = (name) => {
    const c = data.countries.find((x) =>
  (x.properties.ADMIN ||
   x.properties.name ||
   x.properties.NAME) === name
);

    if (!c) return;

    selectedCountry = c;

    highlightCountry(name);

    const L = window.L;
    const bounds = L.geoJSON(c).getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });
  };

  onMount(async () => {
    const Leaflet = await import("leaflet");
    const L = Leaflet.default ?? Leaflet;

    window.L = L;

    map = L.map("map", {
      center: [20, 0],
      zoom: 2
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    const countries = data.countries;

    L.geoJSON(
      { type: "FeatureCollection", features: countries },
      {
        style: {
          color: "#333",
          weight: 1,
          fillColor: "#5dade2",
          fillOpacity: 0.5
        },

        onEachFeature(feature, layer) {
          const name =
            feature.properties.ADMIN ||
            feature.properties.name ||
            feature.properties.NAME ||
            "Unknown";

          layer.bindPopup(name);

          countryLayers[name] = layer;

          layer.on("click", () => {
            selectedCountry = feature;

            highlightCountry(name);

            map.fitBounds(layer.getBounds(), { padding: [20, 20] });

           const cname =
            feature.properties.ADMIN ||
            feature.properties.name ||
            feature.properties.NAME;

            if (selectedCountries.includes(cname)) {
            selectedCountries = selectedCountries.filter(x => x !== cname);
            } else {
            selectedCountries = [...selectedCountries, cname];
            }

          });
        }
      }
    ).addTo(map);
  });

   function defaultStyle() {
    return {
      color: "#333",
      weight: 1,
      fillColor: "#5dade2",
      fillOpacity: 0.5
    };
  }

  function highlightStyle() {
    return {
      color: "#000",
      weight: 2,
      fillColor: "#f1c40f",
      fillOpacity: 0.7
    };
  }

  function selectedStyle() {
  return {
    color: "#1e8449",
    weight: 2,
    fillColor: "#2ecc71",
    fillOpacity: 0.6
  };
}


   function highlightCountry(activeName) {
  Object.entries(countryLayers).forEach(([name, layer]) => {
    // negara lagi dipilih, kuning
    if (name === activeName) {
      layer.setStyle(highlightStyle());
    }
    // selectedCountries, hijau
    else if (selectedCountries.includes(name)) {
      layer.setStyle(selectedStyle());
    }
    // default
    else {
      layer.setStyle(defaultStyle());
    }
  });
}


  function unselectCountry(name) {
  selectedCountries = selectedCountries.filter(c => c !== name);

  // Jika negara yang dibuka di sidebar di-unselect → tutup sidebar
  if (selectedCountry?.properties.name === name) {
    selectedCountry = null;
  }
}

function clearAll() {
  selectedCountries = [];
  selectedCountry = null;

  Object.values(countryLayers).forEach((layer) => {
    layer.setStyle(defaultStyle());
  });
}

function handleCountrySelect(feature) {
  selectedCountry = feature;

  const bounds = L.geoJSON(feature).getBounds();
  map.fitBounds(bounds, { padding: [20, 20] });
}


</script>

<CountrySearch
  countries={allCountries}
  onSelect={handleCountrySelect}
/>

<div id="map" class="w-full h-screen"></div>

<CountrySidebar
  country={selectedCountry}
  allCountries={allCountries}
  selectedCountries={selectedCountries}
  userEmail={userEmail}
  onSelectCountry={selectCountryFromList}
  onUnselectCountry={unselectCountry}
  onClearAll={clearAll}
/>
