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
      }else {
        addNotification("Cannot connect to self", true)
      }
      newConnectionIdInput = ""
    } else addNotification("Please enter a valid ID", true);
  };

  $: !$connectionState.id && (newConnectionIdInput = "");
</script>

<section class="chat-ui min-h-screen">
  <div class="container !h-fit !rounded-xl">
    <ChatHeaderWebrtc />

    <div class="md:p-6 grid h-full">
      <div class="md:border border-neutral-300 rounded-xl">
        {#if !$connectionState.started}
          <StartServerScreen />
        {:else}
          <div
            class="border-b border-neutral-300 p-4 md:p-5 flex items-center gap-4 md:gap-5"
          >
            <input
              type="text"
              maxlength="50"
              placeholder="Enter ID"
              bind:value={newConnectionIdInput}
              class="bg-[#D9D9D9] text-sm placeholder:text-[#38404A]/50 font-mono font-bold outline-none focus:outline-neutral-500 outline-2 max-md:w-full outline-offset-2 px-4 py-2.5 rounded-lg"
            />

            <button
              class="btn-secondary bg-[#555E69] text-sm rounded-lg px-4 shadow-none text-light py-2 font-medium"
              on:click={handleConnectOtherPeer}>Connect</button
            >
          </div>

          <div
            class="border-b border-neutral-300 text-left p-4 md:p-5 font-mono"
          >
            <h3 class="text-[#555E69] font-medium text-sm">
              Select a connection:
            </h3>

            {#if $connectionState.list.length === 0}
              <div class="text-[#555E69]/70 font-medium text-xs mt-3">
                Waiting for connections ...
              </div>
            {:else}
              <div class="flex items-center gap-4 mt-3">
                {#each $connectionState.list as conn}
                  <button
                    class="py-2 px-4 text-sm text-center font-semibold rounded-md {$connectionState.selectedId ===
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
