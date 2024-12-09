<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  import Icon from '@iconify/svelte';
  import { fade } from 'svelte/transition';
  
  import toast, { Toaster } from 'svelte-french-toast';
  import type { ToastOptions } from 'svelte-french-toast'

  import { stringToBoolean } from './lib/utils';

  import NotifcationToggle from './components/NotifcationToggle.svelte';
  import WakeToggle from './components/WakeToggle.svelte';
  import Footer from './components/Footer.svelte';

  let toastDarkmode: ToastOptions = {
    style: "background: #1F2937; color: #fff;"
	};

  let toastLightmode: ToastOptions = {
    style: "background: #fff; color: #333;;"
	};

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
    if (toggleTo) {
      toast('Switched to Darkmode', {
        icon: '🌙',
      });
    } else {
      toast('Switched to Lightmode', {
        icon: '☀️',
      });
    }

  }

  // --- [About Section] --

  let showAboutSection = $state(false)

  function switchAbout(enable: boolean) {
    showAboutSection = enable
  }

</script>

<div 
  class={'min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200 select-none' + (stateDarkMode ? ' dark' : '')}
  transition:fade={{ duration: 180 }}
>
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
      <WakeToggle />
      <NotifcationToggle />
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
        <div 
          class="w-full px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 space-y-3 transition-colors duration-200 my-4"
          transition:fade={{ duration: 180 }}
          class:opacity-100={showAboutSection}
          class:scale-100={showAboutSection}
        >
          <p class="text-base font-semibold text-gray-800 dark:text-gray-100">
            The <strong>NoSleep™</strong> application helps prevent your device from going to sleep when you need it to stay awake.
          </p>
          <div class="space-y-2">
            <div class="flex items-start space-x-2">
              <span class="text-indigo-500 dark:text-indigo-400">•</span>
              <p><strong>NoSleep Mode:</strong> Prevents your device from sleeping, ensuring uninterrupted operation.</p>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-indigo-500 dark:text-indigo-400">•</span>
              <p><strong>Notifications:</strong> Receive notifications if your device is about to enter sleep mode, allowing you to take action and keep it awake.</p>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-indigo-500 dark:text-indigo-400">•</span>
              <p><strong>Dark Mode:</strong> Switch between light and dark themes for better readability and comfort.</p>
            </div>
          </div>
        </div>
      {/if}

    </div>

    <Footer />
  </div>

  <Toaster 
    position="top-center"
    toastOptions={stateDarkMode ? toastDarkmode : toastLightmode}
  />
</div>