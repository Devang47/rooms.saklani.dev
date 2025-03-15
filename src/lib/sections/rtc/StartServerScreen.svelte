<script lang="ts">
  import { startPeer } from "$helpers/peer/peerActions";
  import CircleAnimation from "$lib/components/CircleAnimation.svelte";
  import { connectionState } from "$stores";
</script>

<div class="py-20">
  <button
    aria-label="Start server"
    class="btn-secondary arrow-button w-[140px] bg-[#555E69] text-sm rounded-lg px-4 mx-auto shadow-none text-light py-2 font-medium hover:shadow-none"
    disabled={$connectionState.loading || $connectionState.started}
    on:click={startPeer}
  >
    {#if $connectionState.loading}
      <CircleAnimation class="w-[80px] !text-white" />
    {/if}

    <span class:btn-remove-text={$connectionState.loading}> Start server </span>
  </button>
</div>
