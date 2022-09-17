<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Message from "$lib/components/Message.svelte";
  import Dustbin from "$lib/icons/Dustbin.svelte";
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
  import { onMount } from "svelte";

  let roomId: string;
  let scrollToElement: HTMLDivElement;
  let chatInput = "";

  onMount(async () => {
    roomId = $page.params.id.toUpperCase() as string;

    if (!(await checkIfRoomExists(roomId))) {
      goto("/");
    } else {
      await getRoomMessages(roomId, scrollToBottom);
      loading.set(false);
    }
  });

  $: roomId = $page.params.id.toUpperCase() as string;

  const handleAddMsg = async () => {
    await addMessage({ roomId, message: chatInput });
    chatInput = "";
    scrollToBottom();
  };

  const handleInputChange = async (e: any) => {
    if (e?.target?.files) {
      $loading = true;
      try {
        let url = await uploadFile(roomId, e.target.files[0]);

        chatInput += " " + url;
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

  const handleDeleteRoom = async () => {
    $loading = true;
    await deleteRoom(roomId);
    goto("/");

    $loading = false;
  };

  $: console.log($roomMessages);
</script>

<section class="chat-ui">
  <div class="container">
    <ChatHeader {roomId} {handleDeleteRoom} />

    <div class="chat-messages-wrapper">
      <div class="messages-wrapper">
        {#each $roomMessages as item}
          <Message {roomId} messageData={item} />
        {/each}

        <div class="scroll-bottom" bind:this={scrollToElement} />
      </div>

      <div class="chat-input">
        <textarea
          placeholder="Enter something..."
          name="chat-input"
          id="input"
          cols="30"
          rows="10"
          bind:value={chatInput}
        />
        <div class="buttons">
          <button on:click={handleAddMsg} title="Send message">
            <SendIcon />
          </button>
          <label title="Upload media" class="upload-icon" for="fileinput">
            <UploadIcon />
          </label>
          <input
            type="file"
            class="hidden"
            name="fileinput"
            id="fileinput"
            on:change={handleInputChange}
          />
        </div>
      </div>
    </div>
  </div>
</section>
