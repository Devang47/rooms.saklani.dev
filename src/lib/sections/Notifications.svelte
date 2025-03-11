<script lang="ts">
  import Notification from "$lib/components/Notification.svelte";
  import { notifications } from "$stores";
</script>

{#if $notifications.length !== 0}
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-30"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      {#each $notifications as data}
        <Notification error={data.error} {data} />
      {/each}
    </div>
  </div>
{/if}
