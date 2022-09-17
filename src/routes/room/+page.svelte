<script lang="ts">
  import { loading } from "$stores/app";
  import { checkIfRoomExists } from "$utils/Room";
  import Button from "$lib/components/Button.svelte";
  import CircleAnimation from "$lib/components/CircleAnimation.svelte";
  import ArrowRight from "$lib/icons/ArrowRight.svelte";
  import DashedUnderline from "$lib/icons/DashedUnderline.svelte";
  import CurvedArrowLine from "$lib/icons/CurvedArrowLine.svelte";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  import { goto } from "$app/navigation";
  import { addNotification } from "$utils/notifications";

  let inputVal = "";
  let formLoading = false;
  let roomExists = true;
  const joinRoom = async () => {
    if (!inputVal || inputVal.length < 6) return;
    formLoading = true;

    if (!(await checkIfRoomExists(inputVal))) {
      formLoading = false;
      roomExists = false;

      addNotification("404 Not found!");

      return null;
    }

    goto("/room/" + inputVal);
  };

  onMount(() => {
    loading.set(false);
  });
</script>

<section class="join-room-page">
  <div class="container">
    <div class="relative w-fit mx-auto">
      <h1 class="sans">Join Room</h1>
      <span class="heading-underline"><DashedUnderline /> </span>
    </div>

    <div class="roomid-input">
      <input
        bind:value={inputVal}
        class=""
        placeholder="xxxxxx"
        maxlength="6"
        type="text"
        name=""
        id=" "
      />
      <span class="curved-arrow-line">
        <CurvedArrowLine />
      </span>
    </div>

    <div class="relative w-fit mx-auto group">
      <Button error={!roomExists} class="w-[120px]" on:click={joinRoom}>
        {#if formLoading}
          <CircleAnimation class="w-[80px]" />
        {:else if !roomExists}
          <span in:fly={{ y: 12 }}> Not Found </span>
        {/if}

        <span class:btn-remove-text={formLoading || !roomExists}>
          Join <ArrowRight />
        </span>
      </Button>
    </div>
  </div>
</section>
