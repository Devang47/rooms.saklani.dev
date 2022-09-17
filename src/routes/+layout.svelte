<script lang="ts">
  import Notification from "$lib/sections/Notifications.svelte";
  import LoadingScreen from "$lib/sections/LoadingScreen.svelte";
  import { loading } from "$stores/app";
  import "$styles/global.scss";
</script>

<svelte:head>
  <title>Rooms | Devang Saklani</title>
</svelte:head>

{#if $loading}
  <LoadingScreen />
{/if}

<Notification />

<slot />
