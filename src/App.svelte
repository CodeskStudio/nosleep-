<script>
  import { onMount, onDestroy } from 'svelte';
  import Popup from './components/Popup.svelte';
  import Footer from './components/Footer.svelte';
  import SettingToggle from './components/SettingToggle.svelte';
  import Icon from '@iconify/svelte';

  let isAwake = false;
  let wakeLock = null;
  let isWakeLockSupported = false;

  let darkMode = false;

  const notificationSupported = 'Notification' in window;
  let notificationPermissionGranted = Notification.permission === 'granted';

  let showPopup = false;
  let popupMessage = '';

  let noSleepEnabled = false;
  let notificationsRequested = false;
  let showTooltip = false;

  onMount(() => {
    isWakeLockSupported = 'wakeLock' in navigator;
  });

  onDestroy(() => {
    if (wakeLock) {
      wakeLock.removeEventListener('release', handleWakeLockRelease);
      wakeLock.release();
    }
  });

  async function requestNotificationPermission() {
    if (notificationSupported && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      notificationPermissionGranted = permission === 'granted';
      showPopupMessage(
        notificationPermissionGranted
          ? "Notification permission granted. You'll receive notifications when the device can go to sleep."
          : "Notification permission denied. You won't receive notifications when the device can go to sleep."
      );
    }
  }

  async function toggleWakeLock() {
    if (!isAwake) {
      try {
        wakeLock = await navigator.wakeLock.request('screen');
        isAwake = true;
        wakeLock.addEventListener('release', handleWakeLockRelease);
      } catch (err) {
        console.error(`Failed to lock wake: ${err}`);
      }
    } else {
      if (wakeLock) {
        wakeLock.removeEventListener('release', handleWakeLockRelease);
        await wakeLock.release();
        wakeLock = null;
      }
      isAwake = false;
    }
  }

  function handleWakeLockRelease() {
    isAwake = false;
    wakeLock = null;
    showPopupMessageInfinite(
      'NoSleep™ feature was disabled due to system policy or user action.'
    );

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
    setTimeout(() => (showPopup = false), 10000);
  }

  function showPopupMessageInfinite(message) {
    popupMessage = message;
    showPopup = true;
  }

  function closePopup() {
    showPopup = false;
  }

  function setNoSleepEnabled(value) {
    noSleepEnabled = value;
    showPopupMessage(
      value
        ? 'NoSleep™ feature was enabled. Your device will stay awake.'
        : 'NoSleep™ feature was disabled. Your device may go to sleep.'
    );
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 transition-colors duration-200">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">NoSleep™ Settings</h1>
      <button
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        aria-label="Toggle dark mode"
        onclick={() => (darkMode = !darkMode)}
      >
        {#if darkMode}
          <Icon icon="lucide:sun" class="w-5 h-5" />
        {:else}
          <Icon icon="lucide:moon" class="w-5 h-5" />
        {/if}
      </button>
    </div>

    <div class="space-y-6">
      <SettingToggle
        title="NoSleep Mode"
        description={noSleepEnabled ? 'Device will stay awake' : 'Device may sleep'}
        icon="lucide:moon"
        isEnabled={noSleepEnabled}
        onChange={() => setNoSleepEnabled(!noSleepEnabled)}
      />
      <SettingToggle
        title="Notifications"
        description={
          notificationsRequested
            ? 'Permission granted'
            : 'One-time browser permission required'
        }
        icon="lucide:bell"
        isEnabled={notificationsRequested}
        actionText="Request Permission"
        onAction={requestNotificationPermission}
        showAction={!notificationsRequested}
      />
    </div>

    {#if notificationsRequested}
      <div class="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-500 p-4">
        <div class="flex">
          <Icon icon="lucide:triangle-alert" class="w-5 h-5 text-yellow-400 dark:text-yellow-300" />
          <p class="ml-3 text-sm text-yellow-700 dark:text-yellow-200">
            Notification Permission Granted. Manage or revoke this permission in browser settings.
          </p>
        </div>
      </div>
    {/if}

    {#if showPopup}
      <Popup {showPopup} {popupMessage} {closePopup} />
    {/if}

    <div class="pt-6 border-t border-gray-200 dark:border-gray-700 relative">
      <button
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center justify-center space-x-2 transition-colors duration-200"
        onmouseenter={() => (showTooltip = true)}
        onmouseleave={() => (showTooltip = false)}
      >
        <Icon icon="lucide:info" class="w-4 h-4" />
        <span>About these settings</span>
      </button>
      {#if showTooltip}
        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs rounded shadow-lg">
          <p>
            NoSleep prevents your device from going to sleep.<br />
            Notifications require a one-time browser permission.
          </p>
        </div>
      {/if}
    </div>

    <Footer />
  </div>
</div>