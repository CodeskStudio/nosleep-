<script>
  import { onMount, onDestroy } from 'svelte';
  import WakeLockButton from './components/WakeLockButton.svelte';
  import NotificationButton from './components/NotificationButton.svelte';
  import Popup from './components/Popup.svelte';
  import Footer from './components/Footer.svelte';

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
      if (notificationPermissionGranted) {
        showPopupMessage('Notification permission granted. You\'ll receive notifications when the device can go to sleep.');
      } else {
        showPopupMessage('Notification permission denied. You won\'t receive notifications when the device can go to sleep.');
      }
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
        <WakeLockButton {isAwake} {toggleWakeLock} {isSupported} />
        <NotificationButton
          {notificationSupported}
          {notificationPermissionGranted}
          {requestNotificationPermission}
        />
      </div>
    {/if}
    <p class="mt-4 text-center text-gray-600 dark:text-gray-400">
      {isAwake ? 'Your device will stay awake' : 'Your device may go to sleep'}
    </p>
  </main>

  <Footer />

  <Popup {showPopup} {popupMessage} {closePopup} />
</div>
