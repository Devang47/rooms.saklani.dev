<script lang="ts">
  import { createRoom } from "$utils/Room";

  let roomId = "";

  const handleCreateRoom = async () => {
    roomId = await createRoom();
  };
</script>

<section>
  <div class="container">
    <h1>Create new Private Room</h1>

    <button on:click={handleCreateRoom}> Create </button>

    {#if roomId}
      <div class="">
        <code>
          {roomId}
        </code>
      </div>
    {/if}
  </div>
</section>
