<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";
  import CircleAnimation from "$lib/components/CircleAnimation.svelte";
  import ArrowRight from "$lib/icons/ArrowRight.svelte";
  import CurvedArrowLine from "$lib/icons/CurvedArrowLine.svelte";
  import DashedUnderline from "$lib/icons/DashedUnderline.svelte";
  import FloatingImages from "$lib/sections/FloatingImages.svelte";
  import { loading } from "$stores/app";
  import { createRoom } from "$utils/Room";
  import { onMount } from "svelte";
  import gsap, { Power3 } from "gsap";

  let roomId = "";

  let formLoading = "false";
  const handleCreateRoom = async () => {
    formLoading = "true";
    roomId = await createRoom();
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
      $loading = true;
      goto(`/room/${roomId}`);
    }, 800);
  };

  const handleGotoJoinPage = () => {
    gsap
      .to(".transition-join-page", {
        height: "100%",
        duration: 0.7,
        ease: Power3.easeOut,
      })
      .then(() => {
        setTimeout(() => {
          goto("/room");
        }, 100);
      });
  };

  onMount(() => {
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
</script>

<FloatingImages />

<div class="transition-join-page" />

<section class="homepage">
  <div class="container">
    <div class="content opacity-0">
      <div class="relative w-fit mx-auto">
        <h1 class="sans">Rooms</h1>
        <span class="heading-underline"><DashedUnderline /> </span>
      </div>
      <p>
        In this website you can create a private chat room and share data across
        multiple devices. When you click the button below it will generate a 6
        digit room code which can be then used to join the room from different
        devices. The chat room will automatically delete after 15min.
      </p>

      <div class="relative w-fit mx-auto group">
        <Button class="create-btn" on:click={handleCreateRoom}>
          {#if formLoading === "true"}
            <CircleAnimation class="w-[80px]" />
          {/if}

          <span class:btn-remove-text={formLoading !== "false"}>
            Create a room
            <ArrowRight />
          </span>
        </Button>

        <span class="curved-arrow-line">
          <CurvedArrowLine />
        </span>
      </div>

      <div class="join-btn">
        or <button
          title="Join existing room"
          on:click={handleGotoJoinPage}
          class=""
        >
          Join room
        </button>
      </div>
    </div>

    <div class="bg" />
  </div>
</section>
