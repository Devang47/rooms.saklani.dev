<script lang="ts">
  let btn: HTMLButtonElement;

  export let error: boolean = false;
  export let type: "submit" | "reset" | "button" = "button";
  export let label: string = "default label";
</script>

<button
  on:click
  aria-label={label}
  bind:this={btn}
  class:error
  {type}
  class={`arrow-button group shadow-custom ${$$props.class}`}
>
  <slot />
</button>
