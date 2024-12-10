<script lang="ts">
  import Icon from '@iconify/svelte';
  import toast from 'svelte-french-toast';
  import { sendNotification } from '../lib/notify'
  import { stateNotifications } from '../lib/store'

  let wakeLockObj: WakeLockSentinel = $state(null);
  let wakeEnable: boolean = $state(false);

  function handleWakeLockAbort() {
    console.warn('Wake lock has been released.');

    wakeLockObj = null;
    wakeEnable = false;

    if ($stateNotifications) {
      sendNotification("🌙 NoSleep™ Disabled", "NoSleep™ feature was disabled because you left the page, minimized the browser, or locked the device manually.")
    }

    toast("NoSleep was deactivated!\n\nDon't switch browser tab and keep browser focused.\n\nOther apps can be opend.", {
      duration: 6000,
    })
  }

  async function toggleWakeLock(enable: boolean) {
    if (enable) {
      try {
        wakeLockObj = await navigator.wakeLock.request("screen");
        console.log("activated")
        wakeEnable = true
        toast.success("NoSleep enabled")

        wakeLockObj.addEventListener('release', handleWakeLockAbort);

      } catch (err) {
        console.log(err.name, err.message)
        toast.error(err.name)
      }
    } else {

      wakeLockObj.removeEventListener("release", handleWakeLockAbort)

      wakeLockObj.release().then(() => {
        wakeLockObj = null;
        wakeEnable = false
        toast.error("NoSleep disabled")
      });
    }
  }



</script>
  
<div class="flex items-center justify-between">
  <div class="flex items-center space-x-3">
    <Icon
      icon="lucide:moon"
      class={`w-6 h-6 ${wakeEnable ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}
    />
    <div>
      <h2 class="text-sm font-medium text-gray-900 dark:text-white">NoSleep Mode</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">{wakeEnable ? 'Device will stay awake' : 'Device may sleep'}</p>
    </div>
  </div>
  <div class="flex items-center space-x-4">
    <label class="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        class="sr-only peer"
        checked={wakeEnable}
        onchange={() => toggleWakeLock(!wakeEnable)}
      />
      <div
        class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
      ></div>
    </label>
  </div>
</div>