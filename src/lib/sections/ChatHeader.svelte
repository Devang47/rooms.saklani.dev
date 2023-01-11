<script lang="ts">
  import Dustbin from "$lib/icons/Dustbin.svelte";
  import { roomData, roomMessages } from "$stores/app";
  import { addNotification } from "$utils/notifications";

  export let roomId: string;
  export let handleDeleteRoom: () => void;

  const copyText = () => {
    navigator.clipboard.writeText(roomId);

    addNotification("Copied to clipboard!", false);
  };

  let timeRemainingBeforeRoomDeletion = "";

  function startTimer(duration: number) {
    let timer = duration,
      minutes,
      seconds;
    setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      if (minutes === 0 && seconds === 0) {
        return (timeRemainingBeforeRoomDeletion = "00:00");
      }

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      timeRemainingBeforeRoomDeletion = minutes + ":" + seconds;

      if (--timer < 0) {
        timer = duration;
      }
    }, 1000);
  }

  let time: number = 0;
  $: time = 15 * 60000 - (new Date().getTime() - $roomData.timestamp);
  $: if (time) startTimer(time / 1000);
</script>

<header>
  <h1 role="link" class="sans cursor-pointer">
    <a href="/" on:click={() => ($roomMessages = [])}> ChatRooms </a>
  </h1>
  <div class="flex items-center gap-5">
    <div class="text-light">
      {timeRemainingBeforeRoomDeletion}
    </div>

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
