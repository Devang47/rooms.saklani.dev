<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Message from "$lib/components/Message.svelte";
  import Github from "$lib/icons/Github.svelte";
  import SendIcon from "$lib/icons/SendIcon.svelte";
  import UploadIcon from "$lib/icons/UploadIcon.svelte";
  import ChatHeader from "$lib/sections/ChatHeader.svelte";
  import { loading, roomData, roomMessages } from "$stores/app";
  import { addNotification } from "$utils/notifications";
  import {
    addMessage,
    checkIfRoomExists,
    deleteRoom,
    getRoomMessages,
  } from "$utils/Room";
  import { uploadFile } from "$utils/storage";
  import { onMount } from "svelte";

  let roomId: string;
  let scrollToElement: HTMLDivElement;
  let chatInput = "";
  let chatInputBox: HTMLTextAreaElement;
  let uploadFileInput: HTMLInputElement;

  onMount(async () => {
    roomId = $page.params.id.toUpperCase() as string;

    $roomData = await checkIfRoomExists(roomId);
    if (!$roomData) {
      $roomMessages = [];
      addNotification("Room doesn't exists", true);
      goto("/");
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
    if (e?.target?.files.length > 0) {
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
    goto("/");
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

            <div class="commands-table hidden sm:block">
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
          title="Chat input"
          placeholder="Enter something..."
          name="chat-input"
          id="input"
          cols="30"
          rows="10"
          bind:this={chatInputBox}
          bind:value={chatInput}
        />
        <div class="buttons">
          <button
            on:click={handleAddMsg}
            aria-label="send message button"
            title="Send message"
          >
            <div class="sr-only">Send message</div>
            <SendIcon />
          </button>
          <button
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
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<div
  class="hidden md:block absolute top-4 md:right- lg:right-6 text-white text-sm w-7"
>
  <a
    href="https://github.com/Devang47/rooms.saklani.dev"
    target="_blank"
    rel="noopener noreferrer"
    class="underline w-full"
  >
    <Github />
  </a>
</div>
