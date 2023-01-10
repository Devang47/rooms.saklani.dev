<script lang="ts">
  import { goto } from "$app/navigation";
  import Dustbin from "$lib/icons/Dustbin.svelte";
  import { roomMessages } from "$stores/app";
  import { addNotification } from "$utils/notifications";

  export let roomId: string;
  export let handleDeleteRoom: () => void;

  const copyText = () => {
    navigator.clipboard.writeText(roomId);

    addNotification("Copied to clipboard!", false);
  };
</script>

<header>
  <h1 role="link" class="sans cursor-pointer">
    <a
      href="/"
      on:click={() => {
        $roomMessages = [];
      }}
    >
      ChatRooms
    </a>
  </h1>
  <div class="flex items-center gap-5">
    <button class="room-id group" on:click={copyText}>
      {#each (roomId || "").split("") as letter}
        <span class="letter">
          {letter}
        </span>
      {/each}
    </button>

    <button title="delete room" on:click={handleDeleteRoom} class="delete-btn">
      <Dustbin />
    </button>
  </div>
</header>
