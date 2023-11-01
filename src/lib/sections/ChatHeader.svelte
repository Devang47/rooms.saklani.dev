<script lang="ts">
  import Dustbin from "$lib/icons/Dustbin.svelte";
  import { roomData, roomMessages } from "$stores/app";
  import { addNotification } from "$utils/notifications";
  import { onDestroy } from "svelte";

  export let roomId: string;
  export let handleDeleteRoom: () => void;

  const copyText = () => {
    navigator.clipboard.writeText(roomId);

    addNotification("Copied to clipboard!", false);
  };

  let timeRemainingBeforeRoomDeletion = "";
  let interval: NodeJS.Timer;

  function startTimer(duration: number) {
    if (!$roomData.timestamp) return;
    if (interval) clearInterval(interval);

    let timer = duration,
      minutes,
      seconds;
    interval = setInterval(function () {
      if (!$roomData.timestamp) return clearInterval(interval);

      minutes = parseInt("" + timer / 60, 10);
      seconds = parseInt("" + (timer % 60), 10);

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

  $: !$roomData.timestamp ? (timeRemainingBeforeRoomDeletion = "Deleted") : "";

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<header>
  <a href="/" on:click={() => ($roomMessages = [])}>
    <h1 class="sans cursor-pointer">ChatRooms</h1>
  </a>
  <div class="flex items-center gap-5">
    <div class="text-light text-[15px] hidden sm:block">
      {timeRemainingBeforeRoomDeletion}
    </div>

    <button aria-label="copy room id" class="room-id group" on:click={copyText}>
      {#each (roomId || "").split("") as letter}
        <span class="letter">
          {letter}
        </span>
      {/each}
    </button>

    <button
      aria-label="delete room"
      title="delete room"
      on:click={handleDeleteRoom}
      class="delete-btn"
    >
      <Dustbin />
    </button>
  </div>
</header>
