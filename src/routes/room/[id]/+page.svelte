<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Message from "$lib/components/Message.svelte";
  import Msg from "$lib/icons/Msg.svelte";
  import SendIcon from "$lib/icons/SendIcon.svelte";
  import UploadIcon from "$lib/icons/UploadIcon.svelte";
  import ChatHeader from "$lib/sections/ChatHeader.svelte";
  import { loading, roomMessages } from "$stores/app";
  import {
    addMessage,
    checkIfRoomExists,
    deleteRoom,
    getRoomMessages,
  } from "$utils/Room";
  import { uploadFile } from "$utils/storage";
  import { onDestroy, onMount } from "svelte";

  let roomId: string;
  let scrollToElement: HTMLDivElement;
  let chatInput = "";
  let chatInputBox: HTMLTextAreaElement;
  let uploadLabel: HTMLLabelElement;

  onMount(async () => {
    roomId = $page.params.id.toUpperCase() as string;

    if (!(await checkIfRoomExists(roomId))) {
      $roomMessages = [];
      goto("/", { replaceState: true });
    } else {
      await getRoomMessages(roomId, scrollToBottom);
      loading.set(false);
    }

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

  $: roomId = ($page.params.id || "").toUpperCase() as string;

  const handleAddMsg = async () => {
    chatInput = chatInput.trim();
    if (!chatInput) return;

    let msg = chatInput;
    chatInput = "";
    await addMessage({ roomId, message: msg });
    scrollToBottom();
    if (innerWidth > 640) {
      chatInputBox.focus();
    }
  };

  const handleInputChange = async (e: any) => {
    if (e?.target?.files) {
      $loading = true;
      try {
        let url = await uploadFile(roomId, e.target.files[0]);

        if (chatInput.trim()) return (chatInput += " " + url);
        chatInput += url;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteRoom = async () => {
    $loading = true;
    await deleteRoom(roomId);
    $roomMessages = [];
    goto("/", { replaceState: true });
  };

  const scrollToBottom = () => {
    if (scrollToElement) {
      scrollToElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
</script>

<section class="chat-ui">
  <div class="container">
    <ChatHeader {roomId} {handleDeleteRoom} />

    <div class="chat-messages-wrapper">
      <div class="messages-wrapper">
        {#if !$roomMessages.length}
          <div class="placeholder">
            <SendIcon color="#555E69" />

            <h2 class="">Type and send a message to get started!</h2>

            <div class="commands-table">
              <table class="" border={1}>
                <tr>
                  <td> <code> enter </code> </td>
                  <td>Send Message</td>
                </tr>
                <tr>
                  <td> <code> shift + enter </code> </td>
                  <td>New line</td>
                </tr>
                <tr>
                  <td> <code> / </code> </td>
                  <td>Focus on input</td>
                </tr>
              </table>
            </div>
          </div>
        {:else}
          {#each $roomMessages as item}
            <Message {roomId} messageData={item} />
          {/each}
        {/if}

        <div class="scroll-bottom" bind:this={scrollToElement} />
      </div>

      <div class="chat-input">
        <textarea
          placeholder="Enter something..."
          name="chat-input"
          id="input"
          cols="30"
          rows="10"
          bind:this={chatInputBox}
          bind:value={chatInput}
        />
        <div class="buttons">
          <button on:click={handleAddMsg} title="Send message">
            <SendIcon />
          </button>
          <button class="upload" on:click={() => uploadLabel.click()}>
            <label
              bind:this={uploadLabel}
              title="Upload media"
              class="upload-icon"
              for="fileinput"
            >
              <UploadIcon />
            </label>
            <input
              type="file"
              class="hidden"
              name="fileinput"
              id="fileinput"
              on:change={handleInputChange}
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
