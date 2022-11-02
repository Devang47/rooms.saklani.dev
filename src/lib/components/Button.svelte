<script lang="ts">
  let btn: HTMLButtonElement;

  export let error: boolean = false;
  export let type: "submit" | "reset" | "button" = "button";
</script>

<button
  on:click
  bind:this={btn}
  class:error
  {type}
  class={`arrow-button group shadow-custom ${$$props.class}`}
>
  <slot />
</button>
