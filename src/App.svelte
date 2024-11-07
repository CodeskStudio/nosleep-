<script>
  import { onMount, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';

  let isAwake = false;
  let wakeLock = null;
  let isSupported = false;

  let notificationSupported = 'Notification' in window;
  let notificationPermissionGranted = Notification.permission === 'granted';

  let showPopup = false;
  let popupMessage = '';

  onMount(() => {
    isSupported = 'wakeLock' in navigator;
  });

  async function requestNotificationPermission() {
    if (notificationSupported && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      notificationPermissionGranted = permission === 'granted';
      showPopupMessage("Notification permission granted. You'll receive notifications when the device can go to sleep.");
    }
  }

  async function toggleWakeLock() {
    if (!isAwake) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        isAwake = true;

        wakeLock.addEventListener('release', handleWakeLockAbort);

        closePopup();
      } catch (err) {
        console.error(`Failed to lock wake: ${err}`);
      }
    } else {
      if (wakeLock) {
        wakeLock.removeEventListener('release', handleWakeLockAbort);
        await wakeLock.release();
        wakeLock = null;
      }
      isAwake = false;
    }
  }

  function handleWakeLockAbort() {
    console.warn('Wake lock was released due to system policy or user action');
    isAwake = false;
    wakeLock = null;

    showPopupMessageInfinit('NoSleep™ feature was disabled because you left the page, minimized the browser, or locked the device manually.');

    if (notificationPermissionGranted) {
      new Notification('🌙 NoSleep™ Disabled', {
        body: 'NoSleep™ feature was disabled because you left the page, minimized the browser, or locked the device manually.',
        icon: '/favicon.ico',
      });
    }
  }

  function showPopupMessage(message) {
    popupMessage = message;
    showPopup = true;
    setTimeout(() => {
      showPopup = false;
    }, 10000);
  }

  function showPopupMessageInfinit(message) {
    popupMessage = message;
    showPopup = true;
  }

  function closePopup() {
    showPopup = false;
  }

  onDestroy(() => {
    if (wakeLock) {
      wakeLock.removeEventListener('release', handleWakeLockAbort);
      wakeLock.release();
      wakeLock = null;
    }
  });
</script>

<div class="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
  <main class="flex-grow flex flex-col items-center justify-center p-4">
    {#if !isSupported}
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong class="font-bold">Error: </strong>
        <span class="block sm:inline">Wake Lock API is not supported in your browser.</span>
      </div>
    {:else}
      <div class="flex space-x-2">
        <button
          on:click={toggleWakeLock}
          class="text-2xl p-8 rounded-l-full transition-all {isAwake ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'} text-white font-bold"
          disabled={!isSupported}
        >
          {isAwake ? 'Disable NoSleep™' : 'Enable NoSleep™'}
        </button>
        
        {#if notificationSupported && !notificationPermissionGranted}
          <button
            on:click={requestNotificationPermission}
            class="text-2xl p-8 rounded-r-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold"
          >
            🔔
          </button>
        {:else if notificationPermissionGranted}
          <div class="flex items-center justify-center text-2xl p-8 rounded-r-full bg-green-500 dark:bg-green-600 text-white font-bold">
            🔔
          </div>
        {/if}
      </div>
    {/if}
    <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
      {isAwake ? 'Your device will stay awake' : 'Your device may go to sleep'}
    </p>
  </main>

  <footer class="w-full py-4 px-4 bg-gray-200 dark:bg-gray-800 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">
      &copy; {new Date().getFullYear()} CodeskStudio. All rights reserved.
    </p>
    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2">
      Built with Svelte, TailwindCSS | 
      <a href="https://github.com/CodeskStudio" class="underline hover:text-gray-700 dark:hover:text-gray-300" target="_blank" rel="noopener noreferrer">
        GitHub
      </a>
    </p>
  </footer>


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

</div>