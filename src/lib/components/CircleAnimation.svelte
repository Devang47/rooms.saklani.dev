<script>
  import { fly } from "svelte/transition";
</script>

<div class="spinner {$$props.class}" in:fly={{ y: -24 }}>
  <div class="bounce1" />
  <div class="bounce2" />
  <div class="bounce3" />
</div>

<style lang="postcss">
  .spinner {
    margin: 0 auto 0;
    text-align: center;
  }

  .spinner > div {
    @apply bg-dark;
    width: 9px;
    height: 9px;
    border-radius: 100%;
    display: inline-block;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    animation-delay: -0.16s;
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
</style>
