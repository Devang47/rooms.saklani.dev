<script lang="ts">
import { connectionState, loading, relayMessages } from "$stores";
import { addNotification } from "$utils/notifications";
import { onMount, tick } from "svelte";
import MessageItem from "$lib/components/MessageItem.svelte";
import { DataType, PeerConnection } from "$helpers/peer";
import UploadIcon from "$lib/icons/UploadIcon.svelte";
import { browser } from "$app/environment";
import CallIcon from "$lib/icons/CallIcon.svelte";

let chatInput = "";
let chatInputBox: HTMLTextAreaElement;
let uploadFileInput: HTMLInputElement;
export let handleCallPeer: (id: string) => void;

const handleInputChange = async (e: any) => {
  if (!$connectionState.selectedId) {
    addNotification("Please select a connection", true);
    return;
  }

  if (e?.target?.files.length > 0) {
    $loading = true;
    try {
      let file = e.target.files[0] as unknown as File;
      let blob = new Blob([file], { type: file.type });
      await PeerConnection.sendConnection($connectionState.selectedId, {
        dataType: DataType.FILE,
        file: blob,
        fileName: file.name,
        fileType: file.type,
        deviceId: $connectionState.id ?? "",
        timestamp: String(new Date().getTime()),
      });
    } catch (error) {
      console.log(error);
      addNotification(
        "Failed to deliver file to " + $connectionState.selectedId,
        true,
      );
    }
    $loading = false;
  }
};

const handleAddMsg = async () => {
  const selectedId = $connectionState.selectedId;
  if (!selectedId) {
    addNotification("Please select a connection", true);
    return;
  }

  chatInput = chatInput.trim();
  if (!chatInput) {
    addNotification("Input is empty", true);
    return;
  }

  try {
    loading.set(true);

    let msg = chatInput;

    const data = {
      dataType: DataType.MESSAGE,
      message: msg,
      deviceId: $connectionState.id ?? "",
      timestamp: new Date().toString(),
    };

    await PeerConnection.sendConnection(selectedId, data);
    relayMessages.update((msgs) => {
      msgs.set(selectedId, [
        ...(msgs.get(selectedId) ?? []),
        {
          data: data.message,
          device: data.deviceId,
          deviceId: data.deviceId,
          timestamp: data.timestamp,
        },
      ]);

      return msgs;
    });

    chatInput = "";
    loading.set(false);
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

onMount(async () => {
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

const scrollToBottom = async () => {
  if (browser) {
    await tick();
    document.body.scrollTop = document.body.scrollHeight;
  }
};

relayMessages.subscribe((msgs) => {
  const msgRelay = msgs.get($connectionState.selectedId ?? "") ?? [];
  if (msgRelay.length > 0) scrollToBottom();
});
</script>

<div class="chat-messages-wrapper min-h-[350px] !pb-52 md:!px-5">
  <div class="messages-wrapper">
    {#if !($relayMessages.get($connectionState.selectedId ?? "") ?? []).length}
      <div class="placeholder text-sm">No recent messages</div>
    {:else}
      {#each $relayMessages.get($connectionState.selectedId ?? "") ?? [] as item}
        <MessageItem showMetadata roomId={item.deviceId} messageData={item} />
      {/each}
    {/if}
  </div>
</div>

<div
  class="chat-input absolute bottom-0 left-0 right-0 flex items-start gap-x-4 rounded-b-xl px-4 pb-5 sm:px-6 md:px-12 md:pb-12"
>
  <textarea
    title="Chat input"
    placeholder="Enter something..."
    name="chat-input"
    class="!rounded-xl !px-5 !py-4 !text-sm"
    id="input"
    rows="2"
    bind:this={chatInputBox}
    bind:value={chatInput}
  />
  <div class="flex flex-col gap-4">
    <button
      class="w-full rounded-md bg-dark px-4 py-2 text-xs font-bold text-light disabled:cursor-not-allowed"
      on:click={handleAddMsg}
      disabled={!$connectionState.selectedId}
      aria-label="send message button"
      title="Send message"
    >
      Send
    </button>

    <button
      class="btn-secondary w-full rounded-md bg-light px-4 py-2 text-xs font-bold shadow disabled:cursor-not-allowed"
      title="Upload media"
      aria-label="Upload media button"
      disabled={!$connectionState.selectedId}
      on:click={() => uploadFileInput.click()}
    >
      <div title="Upload media" class="w-5 text-dark">
        <UploadIcon />
      </div>

      <label for="fileinput" class="sr-only">Upload media</label>
      <input
        multiple={false}
        bind:this={uploadFileInput}
        type="file"
        class="sr-only"
        name="fileinput"
        id="fileinput"
        on:change={handleInputChange}
      />
    </button>

    <button
      class="btn-secondary w-full rounded-md bg-light px-4 py-1.5 text-xs font-bold shadow disabled:cursor-not-allowed"
      title="Upload media"
      aria-label="Upload media button"
      disabled={!$connectionState.selectedId}
      on:click={() => handleCallPeer($connectionState.selectedId ?? "")}
    >
      <div title="Upload media" class="w-5 text-dark">
        <CallIcon class="w-5" />
      </div>
    </button>
  </div>
</div>
