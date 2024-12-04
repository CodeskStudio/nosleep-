<script>
    import { createEventDispatcher } from 'svelte';
    import Icon from '@iconify/svelte';
  
    export let title = '';
    export let description = '';
    export let icon = '';
    export let isEnabled = false;
    export let onChange = null; // Function to handle toggle changes
  
    const dispatch = createEventDispatcher();
  
    function handleToggle() {
      if (onChange) {
        onChange();
        dispatch('change', { enabled: !isEnabled });
      }
    }
  
  </script>
  
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <Icon
        icon={icon}
        class={`w-6 h-6 ${isEnabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}`}
      />
      <div>
        <h2 class="text-sm font-medium text-gray-900 dark:text-white">{title}</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <label class="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          class="sr-only peer"
          checked={isEnabled}
          on:change={handleToggle}
        />
        <div
          class="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"
        ></div>
      </label>
    </div>
  </div>
  