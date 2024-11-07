<script>
    export let isAwake;
    export let toggleWakeLock;
    export let isSupported;
  </script>
  
  <div class="flex space-x-2">
    <button
      on:click={toggleWakeLock}
      class="text-2xl p-8 rounded-l-full transition-all {isAwake ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'} text-white font-bold"
      disabled={!isSupported}
    >
      {isAwake ? 'Disable NoSleep™' : 'Enable NoSleep™'}
    </button>
  </div>
  