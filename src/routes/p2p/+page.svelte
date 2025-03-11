<script lang="ts">
  import {
    connectionState,
    loading,
    loadingUpload,
    relayMessages,
  } from "$stores";
  import { addNotification } from "$utils/notifications";
  import { onMount } from "svelte";
  import ChatHeaderWebrtc from "$lib/sections/ChatHeaderWebrtc.svelte";
  import { connectPeer, selectConnection } from "$helpers/peer/actions";
  import MessageItem from "$lib/components/MessageItem.svelte";
  import { DataType, PeerConnection } from "$helpers/peer";
  import StartServerScreen from "$lib/sections/rtc/StartServerScreen.svelte";

  let scrollToElement: HTMLDivElement;
  let chatInput = "";
  let chatInputBox: HTMLTextAreaElement;
  let uploadFileInput: HTMLInputElement;

  onMount(async () => {
    loading.set(false);

    chatInputBox.addEventListener("keypress", (e) => {
      if (innerWidth < 640) return;

      if (e.key === "Enter" && e.shiftKey) {
        e.preventDefault();
        chatInput += "\r\n";
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleAddMsg();
      } else if (e.key === "/") {
      }
    });

    window.addEventListener("keypress", focusOnInput);
  });

  const focusOnInput = (e: KeyboardEvent) => {
    if (innerWidth < 640) return;

    if (e.key === "/") {
      chatInputBox.focus();
    }
  };

  const handleAddMsg = async () => {
    if (!$connectionState.selectedId) {
      addNotification("Please select a connection", true);
      return;
    }

    chatInput = chatInput.trim();
    if (!chatInput) {
      addNotification("Please input is empty", true);
      return;
    }

    try {
      loading.set(true);

      let msg = chatInput;

      const data = {
        dataType: DataType.MESSAGE,
        message: msg,
        deviceId: $connectionState.id ?? "",
        timestamp: String(new Date().getTime()),
      };

      await PeerConnection.sendConnection($connectionState.selectedId, data);
      relayMessages.update((msgs) => [
        ...msgs,
        {
          data: data.message,
          device: data.deviceId,
          deviceId: data.deviceId,
          timestamp: data.timestamp,
        },
      ]);

      chatInput = "";
      loading.set(false);
      scrollToBottom();

      addNotification("Message sent successfully");
      if (innerWidth > 640) {
        chatInputBox.focus();
      }
    } catch (err) {
      loading.set(false);
      console.log(err);
      addNotification("Error when sending message");
    }
  };

  const handleInputChange = async (e: any) => {
    if (e?.target?.files.length > 0) {
      $loading = true;
      $loadingUpload = true;
      try {
        // let url = await uploadFile(roomId, e.target.files[0]);
        // if (chatInput.trim()) return (chatInput += " " + url);
        // chatInput += url
      } catch (error) {
        console.log(error);
      }
    }
  };

  const scrollToBottom = () => {
    if (scrollToElement) {
      scrollToElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  let newConnectionIdInput = "";
  const handleConnectOtherPeer = () => {
    if (newConnectionIdInput.trim() !== "") {
      if (newConnectionIdInput !== $connectionState.id)
        connectPeer(newConnectionIdInput.toLowerCase());
      else addNotification("Cannot connect to self", true);
    } else addNotification("Please enter ID", true);
  };

  $: !$connectionState.id && newConnectionIdInput;
</script>

<section class="chat-ui min-h-screen">
  <div class="container !h-fit !rounded-xl">
    <ChatHeaderWebrtc />

    <div class="p-6 grid h-full">
      <div class="border border-neutral-300 rounded-xl">
        {#if !$connectionState.started}
          <StartServerScreen />
        {:else}
          <div class="border-b border-neutral-300 p-5 flex items-center gap-5">
            <input
              type="text"
              maxlength="50"
              placeholder="Enter ID"
              bind:value={newConnectionIdInput}
              class="bg-[#D9D9D9] text-sm placeholder:text-[#38404A]/50 font-mono font-bold outline-none focus:outline-neutral-500 outline-2 outline-offset-2 px-4 py-2.5 rounded-lg"
            />

            <button
              class="btn-secondary bg-[#555E69] text-sm rounded-lg px-4 shadow-none text-light py-2 font-medium"
              on:click={handleConnectOtherPeer}>Connect</button
            >
          </div>

          <div class="border-b border-neutral-300 text-left p-5 font-mono">
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
            <div class="chat-messages-wrapper pb-32">
              <div class="messages-wrapper">
                {#if !$relayMessages.length}
                  <div class="placeholder text-sm">No recent messages</div>
                {:else}
                  {#each $relayMessages as item}
                    <MessageItem roomId={item.deviceId} messageData={item} />
                  {/each}
                {/if}
              </div>
            </div>

            <div
              class="absolute chat-input bottom-0 left-0 right-0 flex items-start gap-x-4 px-4 sm:px-6 md:px-12 pb-12 rounded-b-xl"
            >
              <textarea
                title="Chat input"
                placeholder="Enter something..."
                name="chat-input"
                class="!h-20 !px-5 !py-4 !rounded-xl !text-sm"
                id="input"
                rows="2"
                bind:this={chatInputBox}
                bind:value={chatInput}
              />
              <div class="flex flex-col gap-2">
                <button
                  class="text-light text-xs w-full bg-dark py-2 px-4 font-bold rounded-md"
                  on:click={handleAddMsg}
                  aria-label="send message button"
                  title="Send message"
                >
                  Send
                </button>
                <button
                  class="btn-secondary shadow text-xs bg-light py-2 px-4 w-full font-bold rounded-md"
                  on:click={handleAddMsg}
                  aria-label="send message button"
                  title="Send message"
                >
                  Clear
                </button>
                <!-- <button
                  class="upload cursor-pointer"
                  title="Upload media"
                  aria-label="Upload media button"
                  on:click={() => uploadFileInput.click()}
                >
                  <label for="fileinput" class="sr-only">Upload media</label>
                  <div title="Upload media" class="upload-icon">
                    <UploadIcon />
                  </div>
                  <input
                    multiple={false}
                    bind:this={uploadFileInput}
                    type="file"
                    class="hidden"
                    name="fileinput"
                    id="fileinput"
                    on:change={handleInputChange}
                  />
                </button> -->
              </div>
            </div>
          {/if}
        {/if}
      </div>
      <div class="scroll-bottom" bind:this={scrollToElement} />
    </div>
  </div>
</section>
