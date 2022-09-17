<script lang="ts">
  import { fly } from "svelte/transition";
  export let data: CustomNotification = {
    data: "lorem ipsum is the best",
  };
</script>

<div
  class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-red-500  shadow-lg ring-1 ring-black ring-opacity-5"
  transition:fly={{ y: -14 }}
>
  <div class="p-4">
    <div class="flex items-center">
      <div class="flex w-0 flex-1 justify-between">
        <p class="w-0 flex-1 text-sm font-medium text-white">
          {data.data}
        </p>
      </div>
    </div>
  </div>
</div>
