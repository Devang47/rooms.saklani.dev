<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Message from "$lib/components/Message.svelte";
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
  import gsap from "gsap";

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

    const tl = gsap.timeline();

    tl.to(".chat-ui", {
      delay: 0.5,
      opacity: 1,
      duration: 0.6,
    }).to(".container", {
      y: 0,
      delay: -0.3,
      opacity: 1,
      duration: 0.4,
    });
  });

  $: roomId = ($page.params.id || "").toUpperCase() as string;

  const handleAddMsg = async () => {
    if (!chatInput) return;

    let msg = chatInput;
    chatInput = "";
    await addMessage({ roomId, message: msg });
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
