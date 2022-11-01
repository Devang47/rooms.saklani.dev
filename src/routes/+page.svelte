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
      <div class=" absolute top-4 right-6 text-white text-sm w-7">
        <a
          href="https://github.com/Devang47/rooms.saklani.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="underline w-full"
        >
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            ><title>GitHub</title><path
              fill="white"
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            /></svg
          >
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
