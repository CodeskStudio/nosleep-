<script>
    export let notificationSupported;
    export let notificationPermissionGranted;
    export let requestNotificationPermission;
  </script>
  
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
  