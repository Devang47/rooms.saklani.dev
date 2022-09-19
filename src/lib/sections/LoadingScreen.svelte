<script>
  import { fade } from "svelte/transition";
</script>

<section transition:fade class="loading-screen">
  <div class="spinner">
    <div class="double-bounce1" />
    <div class="double-bounce2" />
  </div>
</section>
