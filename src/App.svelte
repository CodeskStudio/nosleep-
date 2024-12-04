<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Footer from './components/Footer.svelte';
  import SettingToggle from './components/SettingToggle.svelte';
  import Icon from '@iconify/svelte';

  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";

  const showToast = () => {
    const toast = toasts.add({
      title: 'Message title',
      description: 'Message body',
      duration: 10000, // 0 or negative to avoid auto-remove
      onClick: () => {},
      onRemove: () => {},
    });

  };


  // --- [Utils] --

  function stringToBoolean(str: string): boolean {
      return str.toLowerCase() === 'true';
  }

  // --- [Notify] --

  type NotificationPermission = 'default' | 'granted' | 'denied';

  let notificationStatus: NotificationPermission = $state(Notification.permission)
  let sendNotification: boolean = $state(false)
  let notificationText: string = ((notificationStatus === "granted") && sendNotification) ? "Sie erhalten Benachrichtigungen" : "Sie erhalten keine Benachrichtigungen"

  onMount(() => {
    const loadedNotifyModeState: string = localStorage.getItem("notificationState")

    if (loadedNotifyModeState !== null) {
      sendNotification = stringToBoolean(loadedNotifyModeState)
    }

  })

  function switchNotification(toggleTo: boolean) {
    showToast()
    if (toggleTo) {
      if (notificationStatus === "granted") {

        sendNotification = toggleTo
        localStorage.setItem("notificationState", sendNotification.toString())

      } else if (notificationStatus === "default") {

        console.log("notification request")

        Notification.requestPermission().then((result) => {
          console.log(result);
        });

      } else {

        console.log("notification denied")
        sendNotification = false

      }
    }

  }


  // --- [DarkMode] ---

  let stateDarkMode: boolean = $state(true)

  onMount(() => {
    const loadedDarkModeState: string = localStorage.getItem("darkModeState")

    if (loadedDarkModeState !== null) {
      stateDarkMode = stringToBoolean(loadedDarkModeState)
    }

  })

  function switchDarkMode(toggleTo: boolean) {
    stateDarkMode = toggleTo

    localStorage.setItem("darkModeState", stateDarkMode.toString())
  }

  // --- [WakeLock] ---

  let wakeLockObj: WakeLockSentinel = $state(null);
  let wakeEnable: boolean = $state(false);

  async function toggleWakeLock(enable: boolean) {
    if (enable) {
      try {
        wakeLockObj = await navigator.wakeLock.request("screen");
        console.log("activated")
        wakeEnable = true
      } catch (err) {
        console.log(err.name, err.message)
      }
    } else {
      wakeLockObj.release().then(() => {
        wakeLockObj = null;
        wakeEnable = false
      });
    }
  }

  onMount(() => {
    let isWakeLockSupported: boolean = 'wakeLock' in navigator;
    // console.log("isWakeLockSupported: ", isWakeLockSupported)
  });

  // --- [About Section] --

  let showAboutSection = $state(false)

  function switchAbout(enable: boolean) {
    showAboutSection = enable
  }

</script>

<div class={'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200 select-none' + (stateDarkMode ? ' dark' : '')}>
  <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-8 transition-colors duration-200">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">NoSleep™ Settings</h1>
      <button
        class="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        aria-label="Toggle dark mode"
        onclick={() => switchDarkMode(!stateDarkMode)}
      >
        {#if stateDarkMode}
          <Icon icon="lucide:sun" class="w-5 h-5" />
        {:else}
          <Icon icon="lucide:moon" class="w-5 h-5" />
        {/if}
      </button>
    </div>

    <div class="space-y-6">
      <SettingToggle
        title="NoSleep Mode"
        description={wakeEnable ? 'Device will stay awake' : 'Device may sleep'}
        icon="lucide:moon"
        isEnabled={wakeEnable}
        onChange={() => toggleWakeLock(!wakeEnable)}
      />
      <SettingToggle
        title="Notifications"
        description={notificationText}
        icon="lucide:bell"
        isEnabled={sendNotification}
        onChange={() => switchNotification(!sendNotification)}
      />
    </div>

    <div class="pt-6 border-t border-gray-200 dark:border-gray-700 relative">
      <button
        class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center justify-center space-x-2 transition-colors duration-200"
        onclick={() => switchAbout(!showAboutSection)}
      >
        <Icon icon="lucide:info" class="w-4 h-4" />
        <span>About these settings</span>
      </button>

      {#if showAboutSection}
        <div class="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex space-x-2 transition-colors duration-200 my-4">
          Hallo
        </div>
      {/if}

    </div>

    <Footer />
  </div>

  <ToastContainer 
    placement="bottom-center" 
    let:data={data}
    showProgress
    theme={stateDarkMode ? "dark" : "light"}
    duration={5000}
  >
    <FlatToast {data} />
  </ToastContainer>
</div>