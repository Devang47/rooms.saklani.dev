<script lang="ts">
  import { goto } from "$app/navigation";
  import Dustbin from "$lib/icons/Dustbin.svelte";

  export let roomId: string;
  export let handleDeleteRoom: () => void;

  let copyBtnText = "Copy";
  const copyText = () => {
    navigator.clipboard.writeText(roomId);
    copyBtnText = "Done!";

    setTimeout(() => {
      copyBtnText = "Copy";
    }, 1000);
  };
</script>

<header>
  <h1 on:click={() => goto("/")} class="sans cursor-pointer">Rooms</h1>
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
