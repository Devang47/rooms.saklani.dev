<script>
  import { fade } from "svelte/transition";
  import LoadingBar from "./LoadingBar.svelte";
  import { loadingUpload } from "$stores";
</script>

<section
  transition:fade={{ duration: 0.3 }}
  class="bg-white fixed inset-0 w-full h-full flex items-center justify-center z-50"
>
  {#if $loadingUpload}
    <LoadingBar />
  {:else}
    <div class="container bg-gray-100 p-3.5 w-fit rounded">
      <svg
        width="18"
        viewBox="0 0 16 16"
        fill="none"
        class={"stroke-gray-600 animate-spin"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.33325 8.00001C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6818 1.33334 7.99992 1.33334"
          stroke="current"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  {/if}
</section>
