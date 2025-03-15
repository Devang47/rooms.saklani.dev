<script lang="ts">
import { connectionState, loading } from "$stores";
import { addNotification } from "$utils/notifications";
import { onMount } from "svelte";
import ChatHeaderWebrtc from "$lib/sections/ChatHeaderWebrtc.svelte";
import { connectPeer, selectConnection } from "$helpers/peer/actions";
import StartServerScreen from "$lib/sections/rtc/StartServerScreen.svelte";
import P2PChatUi from "$lib/sections/rtc/P2PChatUI.svelte";

onMount(() => {
  loading.set(false);
});

let newConnectionIdInput = "";

const handleConnectOtherPeer = () => {
  if (newConnectionIdInput.trim() !== "") {
    if (newConnectionIdInput !== $connectionState.id) {
      connectPeer(newConnectionIdInput.toLowerCase());
    } else {
      addNotification("Cannot connect to self", true);
    }
    newConnectionIdInput = "";
  } else addNotification("Please enter a valid ID", true);
};

$: !$connectionState.id && (newConnectionIdInput = "");
</script>

<section class="chat-ui min-h-screen">
  <div class="container !h-fit !rounded-xl">
    <ChatHeaderWebrtc />

    <div class="grid h-full md:p-6">
      <div class="rounded-xl border-neutral-300 md:border">
        {#if !$connectionState.started}
          <StartServerScreen />
        {:else}
          <div
            class="flex items-center gap-4 border-b border-neutral-300 p-4 md:gap-5 md:p-5"
          >
            <input
              type="text"
              maxlength="50"
              placeholder="Enter ID"
              bind:value={newConnectionIdInput}
              class="rounded-lg bg-[#D9D9D9] px-4 py-2.5 font-mono text-sm font-bold outline-none outline-2 outline-offset-2 placeholder:text-[#38404A]/50 focus:outline-neutral-500 max-md:w-full"
            />

            <button
              class="btn-secondary rounded-lg bg-[#555E69] px-4 py-2 text-sm font-medium text-light shadow-none"
              on:click={handleConnectOtherPeer}>Connect</button
            >
          </div>

          <div
            class="border-b border-neutral-300 p-4 text-left font-mono md:p-5"
          >
            <h3 class="text-sm font-medium text-[#555E69]">
              Select a connection:
            </h3>

            {#if $connectionState.list.length === 0}
              <div class="mt-3 text-xs font-medium text-[#555E69]/70">
                Waiting for connections ...
              </div>
            {:else}
              <div class="mt-3 flex items-center gap-4">
                {#each $connectionState.list as conn}
                  <button
                    class="rounded-md px-4 py-2 text-center text-sm font-semibold {$connectionState.selectedId ===
                    conn
                      ? 'bg-[#555E69] text-light shadow-md'
                      : 'bg-[#555E69]/60 text-light'}"
                    on:click={() => selectConnection(conn)}
                  >
                    {conn}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

          {#if $connectionState.started}
            <P2PChatUi />
          {/if}
        {/if}
      </div>
    </div>
  </div>
</section>
