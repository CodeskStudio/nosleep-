<script>
    import { fade } from 'svelte/transition';
  
    export let showPopup;
    export let popupMessage;
    export let closePopup;
  </script>
  
  {#if showPopup}
    <div
      transition:fade="{{ duration: 200 }}"
      class="fixed bottom-60 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-md w-full"
    >
      <button
        on:click={closePopup}
        class="absolute top-2 right-2 h-4 w-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none dark:text-white text-gray-800"
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <p class="text-gray-800 dark:text-gray-200 pr-6">{popupMessage}</p>
    </div>
  {/if}
  