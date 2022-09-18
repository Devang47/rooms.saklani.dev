<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import gsap from "gsap";
  import { browser } from "$app/environment";

  let elements: any;
  onMount(() => {
    elements = document.querySelectorAll(".moveable-block");
    window.addEventListener("mousemove", (e) => {
      animateCircle(e, elements);
    });
  });

  function animateCircle(event: any, elements: any) {
    if (browser) {
      if (document.querySelector(".block-3") == null) {
        return;
      }

      let mouseX = event.clientX / window.innerWidth - 0.5;
      let mouseY = event.clientY / window.innerHeight - 0.5;

      gsap.to([".block-1", ".block-3"], {
        x: 40 * mouseX,
        y: 40 * mouseY,
        duration: 0.5,
      });
      gsap.to(".block-0", {
        x: 20 * mouseX,
        y: 20 * mouseY,
        duration: 0.5,
      });
      gsap.to([".block-2"], {
        x: 10 * mouseX,
        y: 10 * mouseY,
        duration: 0.5,
      });
    }
  }

  onDestroy(() => {
    if (browser) {
      window.removeEventListener("mousemove", (e) => {
        animateCircle(e, elements);
      });
    }
  });

  let i = 0;
</script>

<div
  class="moveable-block block-{i++} top-20 left-[-100px] !w-[20rem] !h-[10rem] translate-x-[-80px]"
>
  <img
    src="https://res.cloudinary.com/dyn3sdtfm/image/upload/c_scale,w_600/v1663411910/s-o-c-i-a-l-c-u-t-OjnmCKmzr3A-unsplash_wwntkj.webp"
    alt=""
  />
</div>

<div
  class="moveable-block block-{i++} top-[60vh] left-[14vw] !w-[18rem] !h-[10rem] translate-x-[-100px]"
>
  <img
    src="https://res.cloudinary.com/dyn3sdtfm/image/upload/c_scale,w_600/v1663412785/robert-keane-HFcxrs5u4uE-unsplash_qxzngi.webp"
    alt=""
  />
</div>

<div
  class="moveable-block block-{i++} top-[80vh] right-[15vw] !w-[18rem] !h-[20rem] translate-x-[80px]"
>
  <img
    src="https://res.cloudinary.com/dyn3sdtfm/image/upload/c_scale,w_600/v1663412879/kobu-agency-k41cAJvJ7h0-unsplash_atqohj.webp"
    alt=""
  />
</div>

<div
  class="hidden md:block moveable-block block-{i++} top-28 right-[-4vw] !w-[18rem] !h-[15rem] translate-x-[100px]"
>
  <img
    src="https://res.cloudinary.com/dyn3sdtfm/image/upload/c_scale,w_600/v1663411907/engin-akyurt-G26eJNYZA24-unsplash_kffjfa.webp"
    alt=""
  />
</div>

<style lang="postcss">
  div {
    @apply absolute w-80 h-60 rounded-[30px] overflow-hidden bg-dark duration-[0.01s] transition-all z-10 opacity-0;
    box-shadow: 0px 109px 92px rgba(0, 0, 0, 0.09),
      0px 45.5376px 38.4354px rgba(0, 0, 0, 0.0646969),
      0px 24.3466px 20.5494px rgba(0, 0, 0, 0.0536497),
      0px 13.6485px 11.5198px rgba(0, 0, 0, 0.045),
      0px 7.24861px 6.11809px rgba(0, 0, 0, 0.0363503),
      0px 3.01631px 2.54588px rgba(0, 0, 0, 0.0253031);
  }

  img {
    @apply w-full h-full object-cover;
  }
</style>
