<script lang="ts">
  import { connectionState, relayMessages } from "$stores";
  import { addNotification } from "$utils/notifications";
  import { PeerConnection } from "$helpers/peer";
  import { stopPeerSession } from "$helpers/peer/actions";
  import { startPeer } from "$helpers/peer/peerActions";

  const copyText = () => {
    if (!$connectionState.id) return;
    navigator.clipboard.writeText($connectionState.id);

    addNotification("Copied to clipboard!", false);
  };

  const handleStartServer = async () => {
    startPeer();
  };

  const handleStopServer = async () => {
    await PeerConnection.closePeerSession();
    relayMessages.set(new Map());

    stopPeerSession();
  };
</script>

<header class="!rounded-t-lg md:!px-6">
  <a href="/">
    <h1 class="sans cursor-pointer whitespace-nowrap">P2P Rooms</h1>
  </a>
  <div class="flex items-center gap-3 lg:gap-5">
    {#if $connectionState.loading}
      <div class="px-4">
        <svg
          width="18"
          viewBox="0 0 16 16"
          fill="none"
          class={"stroke-white animate-spin"}
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

    {#if $connectionState.id}
      <button
        aria-label="copy room id"
        class="bg-[#D9D9D9] px-3 md:px-4 text-[#38404A] text-[15px] font-extrabold flex items-center justify-center gap-1 rounded cursor-pointer relative overflow-hidden text-sm py-1.5 md:py-2"
        on:click={copyText}
      >
        {$connectionState.id}
      </button>
    {/if}

    <button
      aria-label="toggle peerjs server"
      class="bg-[#D9D9D9] px-3 md:px-4 text-[#38404A] text-[15px] font-extrabold flex items-center justify-center gap-1 rounded cursor-pointer relative overflow-hidden text-sm py-1.5 md:py-2"
      on:click={$connectionState.started ? handleStopServer : handleStartServer}
    >
      {#if $connectionState.started}
        Stop
      {:else}
        Start
      {/if}
    </button>
  </div>
</header>
