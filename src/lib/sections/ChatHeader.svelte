<script lang="ts">
  import { goto } from "$app/navigation";
  import Dustbin from "$lib/icons/Dustbin.svelte";
  import { addNotification } from "$utils/notifications";

  export let roomId: string;
  export let handleDeleteRoom: () => void;

  let copyBtnText = "Copy";
  const copyText = () => {
    navigator.clipboard.writeText(roomId);

    addNotification("Copied to clipboard!", false);
  };
</script>

<header>
  <h1 role="link" on:click={() => goto("/")} class="sans cursor-pointer">
    ChatRooms
  </h1>
  <div class="flex items-center gap-5">
    <div class="room-id group" on:click={copyText}>
      {#each (roomId || "").split("") as letter}
        <span class="letter">
          {letter}
        </span>
      {/each}

      <button title="Copy code" class="copy-btn">{copyBtnText}</button>
    </div>

    <button title="delete room" on:click={handleDeleteRoom} class="delete-btn">
      <Dustbin />
    </button>
  </div>
</header>
