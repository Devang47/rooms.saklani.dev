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
  import Github from "$lib/icons/Github.svelte";

  let roomId = "";

  let formLoading = "false";

  const transitionJoinPageStart = (callback: () => void) => {
    gsap
      .to(".transition-join-page", {
        height: "100%",
        duration: 0.7,
        ease: Power3.easeOut,
      })
      .then(callback);
  };

  const handleCreateRoom = async () => {
    formLoading = "true";
    roomId = await createRoom();
    formLoading = "complete";

    transitionJoinPageStart(() => {
      setTimeout(() => {
        $loading = true;
        goto(`/room/${roomId}`);
      }, 100);
    });
  };

  const handleGotoJoinPage = () => {
    transitionJoinPageStart(() => {
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
      duration: 1,
      ease: Power3.easeOut,
    })
      .to(".content", {
        delay: -0.6,
        opacity: 1,
        duration: 0.4,
      })
      .to(".moveable-block", {
        delay: -0.7,
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
  <div class="container relative">
    <div class="content opacity-0">
      <div class="relative w-fit mx-auto">
        <h1 class="sans">ChatRooms</h1>
        <span class="heading-underline"><DashedUnderline /> </span>
      </div>
      <p>
        On this website, you can create a private chat room and share data
        across multiple devices. When you click the button below it will
        generate a 6-digit room code which can be then used to join the room
        from different devices. The chat room will automatically delete after
        15min.
      </p>

      <div class="relative w-fit mx-auto group">
        <Button
          label="create a room"
          class="create-btn"
          on:click={handleCreateRoom}
        >
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
          aria-label="Join existing room"
          title="Join existing room"
          on:click={handleGotoJoinPage}
          class=""
        >
          Join room
        </button>
      </div>
      <div class=" absolute top-4 right-6 text-white text-sm w-7">
        <a
          href="https://github.com/Devang47/rooms.saklani.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="underline w-full"
        >
          <Github />
        </a>
      </div>
    </div>

    <div class="bg" />
  </div>
</section>

<style lang="postcss">
  :global(html) {
    @apply !overflow-hidden;
  }
</style>
