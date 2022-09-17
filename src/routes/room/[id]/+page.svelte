<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Message from "$lib/components/Message.svelte";
  import SendIcon from "$lib/icons/SendIcon.svelte";
  import UploadIcon from "$lib/icons/UploadIcon.svelte";
  import { chatInput, loading, roomMessages } from "$stores/app";
  import { addMessage, checkIfRoomExists, getRoomMessages } from "$utils/Room";
  import { uploadFile } from "$utils/storage";
  import { onMount } from "svelte";

  let roomId: string;
  let scrollToElement: HTMLDivElement;
  onMount(async () => {
    roomId = $page.params.id as string;

    if (!(await checkIfRoomExists(roomId))) {
      goto("/");
    } else {
      getRoomMessages(roomId);
      scrollToElement.scrollIntoView({
        behavior: "smooth",
      });
      loading.set(false);
    }
  });

  const handleAddMsg = async () => {
    await addMessage({ roomId, message: $chatInput });

    scrollToElement.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleInputChange = (e: any) => {
    console.log(e);
    if (e?.target?.files) {
      $loading = true;
      uploadFile(roomId, e.target.files[0]);
    }
  };
</script>

<section class="chat-ui">
  <div class="container">
    <header>
      <h1 on:click={() => goto("/")} class="sans cursor-pointer">Rooms</h1>
      <div class="room-id">
        {#each "324324".split("") as letter}
          <span class="letter sans">
            {letter}
          </span>
        {/each}
      </div>
    </header>

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
          bind:value={$chatInput}
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
