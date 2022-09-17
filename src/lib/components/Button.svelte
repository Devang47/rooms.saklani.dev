<script lang="ts">
  import { animate } from "motion";

  let btn: HTMLButtonElement;

  export let error: boolean = false;
</script>

<button
  on:click
  bind:this={btn}
  class:error
  class={`arrow-button group shadow-custom ${$$props.class}`}
>
  <slot />
</button>
