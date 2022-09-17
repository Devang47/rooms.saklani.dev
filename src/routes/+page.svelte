<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import CircleAnimation from "$lib/components/CircleAnimation.svelte";
  import ArrowRight from "$lib/icons/ArrowRight.svelte";
  import CurvedArrowLine from "$lib/icons/CurvedArrowLine.svelte";
  import DashedUnderline from "$lib/icons/DashedUnderline.svelte";
  import { loading } from "$stores/app";
  import { createRoom } from "$utils/Room";
  import { onMount } from "svelte";

  let roomId = "";

  let formLoading = false;
  const handleCreateRoom = async () => {
    formLoading = true;
    roomId = await createRoom();
    goto(`/room/${roomId}`);
  };

  onMount(() => {
    loading.set(false);
  });
</script>

<section class="homepage">
  <div class="container">
    <div class="relative w-fit mx-auto">
      <h1 class="sans">Rooms</h1>
      <span class="heading-underline"><DashedUnderline /> </span>
    </div>
    <p>
      In this website you can create a private chat room, when you click the
      button below it will generate a 6 digit room code which can be then used
      to join the room from different devices.
    </p>

    <div class="relative w-fit mx-auto group">
      <Button class="w-[175px] md:w-[189px]" on:click={handleCreateRoom}>
        {#if formLoading}
          <CircleAnimation />
        {/if}

        <span class:btn-remove-text={formLoading}>
          Create a room
          <ArrowRight />
        </span>
      </Button>

      <span class="curved-arrow-line">
        <CurvedArrowLine />
      </span>
    </div>

    <div class="join-btn">
      or <a href="/room" class=""> Join room </a>
    </div>
  </div>
</section>
