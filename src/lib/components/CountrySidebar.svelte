<script>
  export let country = null;
  export let allCountries = [];
  export let selectedCountries = [];
  export let userEmail = "";
  export let onSelectCountry = () => {};
  export let onUnselectCountry = () => {};
  export let onClearAll = () => {};


  let jsPDF;
  import("jspdf").then((mod) => {
    jsPDF = mod.default;
  });

  function downloadPDF() {
    if (!jsPDF) return;

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("Hexa Map Report", 10, 10);

    doc.setFontSize(12);
    doc.text(`Email: ${userEmail}`, 10, 20);
    doc.text(`Timestamp: ${timestamp}`, 10, 30);
    doc.text(`Selected Countries: ${selectedCountries.length}`, 10, 40);

    // Selected list
    doc.text("Selected Countries:", 10, 55);
    selectedCountries.forEach((c, i) => {
      doc.text(`- ${c}`, 15, 65 + i * 6);
    });

    // All countries
    const startY = 65 + selectedCountries.length * 6 + 10;
    doc.text("All Countries:", 10, startY);
    allCountries.forEach((c, i) => {
      doc.text(`- ${c}`, 15, startY + 10 + i * 6);
    });

    doc.save("hexa-map-report.pdf");
  }

  function unselectCountry(name) {
  onUnselectCountry(name);
}
</script>

<div
  class="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 
         z-[9999] overflow-y-auto transition-transform duration-300 ease-out"
  style="transform: translateX({country ? '0' : '100%'})"
>
  {#if country}
    <!-- HEADER -->
    <div class="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow">
      <h2 class="text-2xl font-bold">
        {country.properties.name || country.properties.ADMIN}
      </h2>

      <p class="opacity-80 text-sm mt-1">
        {country.properties["ISO3166-1-Alpha-2"]} ·
        {country.properties["ISO3166-1-Alpha-3"]}
      </p>
    </div>

    <!-- CONTENT -->
    <div class="p-6 space-y-6">

      <!-- INFO CARD -->
      <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">Country Information</h3>

        <div class="space-y-2 text-sm text-gray-700">
          <p><strong>ISO Alpha-2:</strong> {country.properties["ISO3166-1-Alpha-2"] || "N/A"}</p>
          <p><strong>ISO Alpha-3:</strong> {country.properties["ISO3166-1-Alpha-3"] || "N/A"}</p>
        </div>
      </div>

      <!-- SELECTED COUNTRIES -->
      <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">
          Selected Countries ({selectedCountries.length})
        </h3>

        <button
            class="w-full py-2 mt-3 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
            on:click={() => onClearAll()}
            >
            Clear All Selected
            </button>

        <ul class="text-sm space-y-1">
          {#each selectedCountries as c}
             <li class="flex justify-between items-center">
            <span>• {c}</span>
            
            <button
                class="text-red-500 text-xs hover:underline"
                on:click={() => unselectCountry(c)}
            >
                ✕
            </button>
            </li>
          {/each}
        </ul>
      </div>

      <!-- ALL COUNTRIES LIST -->
      <div class="bg-gray-50 p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold mb-3 text-gray-700">
          All Countries
        </h3>

        <ul class="text-sm space-y-1 max-h-64 overflow-y-auto">
          {#each allCountries as c}
            <li>
              <button
                class="w-full text-left hover:underline hover:text-blue-600"
                on:click={() => onSelectCountry(c.properties.ADMIN)}
              >
                • {c.properties.ADMIN || c.properties.name || c.properties.NAME}
              </button>
            </li>
          {/each}
        </ul>
      </div>

     <!-- PDF BUTTON -->
        <button
        class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow"
        on:click={downloadPDF}
        >
        Download as PDF
        </button>

        </div>
        {/if}
</div>