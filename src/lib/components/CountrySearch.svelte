<script>
  export let countries = [];
  export let onSelect = () => {};

  let query = "";
  let filtered = [];
  
 $: filtered = query.length > 1
  ? countries.filter(c =>
      getName(c).toLowerCase().includes(query.toLowerCase())
    )
  : [];


    function getName(c) {
        return (
            c.properties.ADMIN ||
            c.properties.name ||
            c.properties.NAME ||
            ""
        );
        }


</script>

<div class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-72">
  <input
    type="text"
    placeholder="Search country..."
    bind:value={query}
    class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow bg-white"
  />

  {#if filtered.length > 0}
    <ul class="bg-white border border-gray-300 rounded-lg mt-2 max-h-48 overflow-y-auto shadow">
      {#each filtered as item}
        <button
        type="button"
        on:click={() => {
            onSelect(item);
            query = "";
        }}
        class="block w-full text-left px-3 py-2 hover:bg-blue-100 cursor-pointer"
        >
        {getName(item)}
        </button>

      {/each}
    </ul>
  {/if}
</div>
