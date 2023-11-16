<script lang="ts">
  import { clickOutside } from "$lib/hooks/useClickOutside";
  import { fade, scale } from "svelte/transition";

  export let onClose: () => void;
</script>

<section transition:fade={{ duration: 200 }}>
  <div
    transition:scale={{ start: 0.9, opacity: 0, duration: 200 }}
    use:clickOutside={onClose}
    class="modal"
  >
    <slot />
  </div>
</section>

<style lang="postcss">
  section {
    @apply bg-black/50 flex items-center justify-center fixed inset-0 w-full h-full z-50;
  }

  .modal {
    @apply px-4 py-2 bg-light rounded-lg w-fit max-w-md h-fit;
  }
</style>
