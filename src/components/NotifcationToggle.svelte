<script lang="ts">
  import { onMount } from 'svelte';
  import toast from 'svelte-french-toast';
  import { stringToBoolean } from '../lib/utils'
  import { stateNotifications } from '../lib/store'


  import Icon from '@iconify/svelte';

  type NotificationPermission = 'default' | 'granted' | 'denied';

  // let sendNotification: boolean = $state(false)
  let isToggleDisabled = $state(Notification.permission === "denied")

  let description = $derived.by(() => {

    if (!$stateNotifications) {
      return isToggleDisabled ? "Notification blocked by Browser" : "Notification disabled";
    }

    return "Notification enabled";

  });


  onMount(() => {
    const loadedNotifyModeState: string = localStorage.getItem("notificationState")

    if (loadedNotifyModeState !== null) {
      $stateNotifications = stringToBoolean(loadedNotifyModeState)
    }

    if (Notification.permission === "denied" || Notification.permission === "default") {
      $stateNotifications = false
      localStorage.setItem("notificationState", "false")
    }

  })



  function requestNotificationPermission() {
    return Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        localStorage.setItem("notificationState", "true")
        return 'Permission granted';
      } else {
        $stateNotifications = false
        localStorage.setItem("notificationState", "true")
        throw new Error('Permission denied');
      }
    });
  }


  function switchNotification(event: Event) {
    const toggleTo = (event.target as HTMLInputElement).checked;

    if (toggleTo) {
      const currentStatus: NotificationPermission = Notification.permission
      if (currentStatus === "granted") {

        $stateNotifications = toggleTo
        localStorage.setItem("notificationState", $stateNotifications.toString())

        toast.success("Notification enabled")

      } else if (currentStatus === "default") {

        console.log("notification request")

        toast.promise(
          requestNotificationPermission(),
          {
            loading: 'Requesting...',
            success: (message) => message,
            error: (error) => error.message,
          }
        );

        $stateNotifications = toggleTo

      } else {
        toast.error("Notification Permission blocked")
        $stateNotifications = false

      }
    } else {
      $stateNotifications = toggleTo
      localStorage.setItem("notificationState", $stateNotifications.toString())
      toast.error("Notification disabled")
    }

  }
  
</script>
  
<div class="flex items-center justify-between">
  <div class="flex items-center space-x-3">
    <Icon
      icon="lucide:bell"
      class={`w-6 h-6 ${$stateNotifications ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}
    />
    <div>
      <h2 class="text-sm font-medium text-gray-900 dark:text-white">Notifications</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
  <div class="flex items-center space-x-4">
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        checked={$stateNotifications}
        onchange={switchNotification}
        disabled={isToggleDisabled}
      />
      <div
        class={"w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 " + (isToggleDisabled ? "opacity-50 cursor-not-allowed" : "")}
      ></div>
    </label>
  </div>
</div>