<script lang="ts">
  import { roomMessages } from "$stores/app";
  import { getRoomMessages } from "$utils/Room";

  let inputVal = "";
  const joinRoom = async () => {
    console.log({ inputVal });
    getRoomMessages(inputVal);
  };

  $: if ($roomMessages.length) {
    console.log($roomMessages, "exists");
  }
</script>

<form action="" on:submit|preventDefault={joinRoom}>
  <input bind:value={inputVal} type="text" name="" id="" />
  <button> Join </button>
</form>
