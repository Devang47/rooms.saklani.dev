<script lang="ts">
  import { loading, roomData } from "$stores/app";
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
  import gsap, { Power3 } from "gsap";
  import FloatingImages from "$lib/sections/FloatingImages.svelte";

  let inputVal = "";
  let formLoading = "false";
  let roomExists = true;
  const joinRoom = async () => {
    if (!inputVal || inputVal.length < 6) return;
    formLoading = "true";

    $roomData = await checkIfRoomExists(inputVal);
    if (!$roomData) {
      formLoading = "false";
      roomExists = false;

      addNotification("404 Not found!", true);

      return null;
    }

    roomExists = true;
    formLoading = "complete";

    gsap.to(".moveable-block", {
      opacity: 0,
      duration: 0.1,
    });

    gsap.to(".arrow-button", {
      scale: 100,
      duration: 0.3,
      ease: "linear",
    });

    setTimeout(() => {
      goto("/room/" + inputVal);
    }, 800);
  };

  onMount(() => {
    loading.set(false);
    loading.set(false);

    const tl = gsap.timeline({});

    tl.to(".bg", {
      delay: 0.2,
      width: "100%",
      duration: 0.8,
      ease: Power3.easeOut,
    })
      .to(".content", {
        delay: -0.5,
        opacity: 1,
        duration: 0.4,
      })
      .to(".moveable-block", {
        delay: -0.6,
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.4,
      });
  });

  const handleGotoCreatePage = () => {
    gsap
      .to(".transition-join-page", {
        height: "100%",
        duration: 0.7,
        ease: Power3.easeOut,
      })
      .then(() => {
        setTimeout(() => {
          goto("/");
        }, 100);
      });
  };
</script>

<FloatingImages />

<div class="transition-join-page" />

<section class="join-room-page">
  <div class="container">
    <div class="content opacity-0">
      <div class="relative w-fit mx-auto">
        <h1 class="sans">Join Room</h1>
        <span class="heading-underline"><DashedUnderline /> </span>
      </div>

      <form action="#" on:submit|preventDefault={joinRoom}>
        <div class="roomid-input">
          <input
            bind:value={inputVal}
            class=""
            placeholder="xxxxxx"
            maxlength="6"
            type="text"
            name=""
            id=""
          />
          <span class="curved-arrow-line">
            <CurvedArrowLine />
          </span>
        </div>

        <div class="relative w-fit mx-auto group">
          <Button
            label="Join room"
            type="submit"
            error={!roomExists}
            class="arrow-button"
          >
            {#if formLoading === "true"}
              <CircleAnimation class="w-[80px]" />
            {:else if !roomExists}
              <span in:fly={{ y: 12 }}> Not Found </span>
            {/if}

            <span
              class:btn-remove-text={formLoading !== "false" || !roomExists}
            >
              Join <ArrowRight />
            </span>
          </Button>

          <div class="create-btn">
            or <button
              aria-label="create a new room"
              type="button"
              title="Create room"
              on:click={handleGotoCreatePage}
              class=""
            >
              Create room
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="bg" />
  </div>
</section>
