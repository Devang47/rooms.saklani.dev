<script lang="ts">
import { goto } from "$app/navigation";
import Button from "$lib/components/Button.svelte";
import CircleAnimation from "$lib/components/CircleAnimation.svelte";
import ArrowRight from "$lib/icons/ArrowRight.svelte";
import CurvedArrowLine from "$lib/icons/CurvedArrowLine.svelte";
import DashedUnderline from "$lib/icons/DashedUnderline.svelte";
import Github from "$lib/icons/Github.svelte";
import FloatingImages from "$lib/sections/FloatingImages.svelte";
import { loading } from "$stores";
import { createRoom } from "$helpers/Room";
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
  <div
    class="relative z-[1] mx-auto mb-5 flex h-full min-h-[600px] w-full flex-col items-center justify-center rounded-[30px] px-6 py-20 pb-10 font-mono md:rounded-[40px] md:py-4"
  >
    <div class="content opacity-0">
      <div class="relative mx-auto w-fit">
        <h1
          class="sans relative text-[40px] font-bold text-white text-opacity-90 sm:text-[55px] md:text-[70px] lg:text-[80px]"
        >
          ChatRooms
        </h1>
        <span
          class="absolute bottom-1 left-1/2 w-10/12 -translate-x-1/2 md:bottom-1"
          ><DashedUnderline />
        </span>
      </div>

      <p
        class="mx-auto mt-4 max-w-md text-[14px] text-white text-opacity-70 sm:max-w-lg md:max-w-xl md:text-[16px]"
      >
        On this website, you can create a private chat room and share data
        across multiple devices.
      </p>

      <div
        class="mt-10 flex flex-col items-center justify-center gap-10 text-left font-mono text-white md:flex-row md:gap-6 lg:gap-12"
      >
        <div class="md:h-[340px] md:max-w-[20rem]">
          <h2 class="text-lg font-semibold md:text-xl">
            Traditional Chatrooms
          </h2>
          <ul class="mt-3 space-y-1 text-sm font-medium opacity-80">
            <li>
              <span>✅</span> Uses Firebase to store messages and files
            </li>

            <li>
              <span>✅</span> Connect Multiple devices concurrently
            </li>

            <li><span>✅</span> Messages history</li>

            <li><span>✅</span> Auto delete all data after 15min</li>

            <li><span>✅</span> Secure</li>

            <li><span>❌</span> End to end encrypted</li>
          </ul>

          <Button
            label="create a room"
            class="relative z-20 mt-5 w-[175px] text-sm md:w-[189px]"
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
        </div>
        <div class="opacity-60 md:hidden">
          <svg
            width="296"
            height="2"
            viewBox="0 0 296 2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="-0.00012207"
              y1="1.00061"
              x2="296"
              y2="1.00061"
              stroke="#E2E3E4"
              stroke-width="2"
              stroke-dasharray="11 11"
            />
          </svg>
        </div>
        <div class="opacity-60 max-md:hidden">
          <svg
            height="250"
            viewBox="0 0 2 296"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="1"
              y1="296"
              x2="0.999987"
              y2="4.37114e-08"
              stroke="#E2E3E4"
              stroke-width="2"
              stroke-dasharray="11 11"
            />
          </svg>
        </div>
        <div class="md:h-[340px] md:max-w-[20rem]">
          <h2 class="text-lg font-semibold md:text-xl">
            WebRTC based Chatrooms
          </h2>
          <ul class="mt-3 space-y-1 text-sm font-medium opacity-80">
            <li>
              <span>✅</span> Uses WebRTC to transfer messages and files
            </li>

            <li>
              <span>✅</span> 2 Device limit per room
            </li>

            <li>
              <span>✅</span> No messages history
            </li>

            <li>
              <span>✅</span> End to end encrypted
            </li>

            <li>
              <span>✅</span> File transfers
            </li>

            <li>
              <span>✅</span> Video calls (coming soon)
            </li>
          </ul>

          <a href="/p2p">
            <Button
              label="create a room"
              class="relative z-20 mt-5 w-[175px] text-sm md:w-[189px]"
            >
              {#if formLoading === "true"}
                <CircleAnimation class="w-[80px]" />
              {/if}

              <span class:btn-remove-text={formLoading !== "false"}>
                Start server
                <ArrowRight />
              </span>
            </Button>
          </a>
        </div>
      </div>

      <div class="absolute right-6 top-4 w-7 text-sm text-white">
        <a
          href="https://github.com/Devang47/rooms.saklani.dev"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full underline"
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

li span {
  @apply absolute left-0;
}

li {
  @apply relative pl-6;
}
</style>
