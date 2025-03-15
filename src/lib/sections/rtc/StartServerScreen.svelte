<script lang="ts">
import { startPeer } from "$helpers/peer/peerActions";
import CircleAnimation from "$lib/components/CircleAnimation.svelte";
import { connectionState } from "$stores";
</script>

<div class="py-20">
  <button
    aria-label="Start server"
    class="btn-secondary arrow-button mx-auto w-[140px] rounded-lg bg-[#555E69] px-4 py-2 text-sm font-medium text-light shadow-none hover:shadow-none"
    disabled={$connectionState.loading || $connectionState.started}
    on:click={startPeer}
  >
    {#if $connectionState.loading}
      <CircleAnimation class="w-[80px] !text-white" />
    {/if}

    <span class:btn-remove-text={$connectionState.loading}> Start server </span>
  </button>
</div>
