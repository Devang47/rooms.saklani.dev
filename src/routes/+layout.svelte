<script lang="ts">
  import Notification from "$lib/sections/Notifications.svelte";
  import LoadingScreen from "$lib/sections/LoadingScreen.svelte";
  import { loading } from "$stores/app";
  import SvelteSeo from "svelte-seo";

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

<SvelteSeo
  title="Rooms | Devang Saklani"
  description="At rooms.saklani.dev you can create a private chat room and share data across multiple devices, the chat room will automatically delete after 15min.."
  openGraph={{
    type: "website",
    title: "Rooms | Devang Saklani",
    description:
      "At rooms.saklani.dev you can create a private chat room and share data across multiple devices, the chat room will automatically delete after 15min.",
    url: "https://saklani.dev",
    images: [
      {
        url: "https://res.cloudinary.com/dyn3sdtfm/image/upload/v1663470958/og1_l965qv.webp",
      },
    ],
  }}
  twitter={{
    card: "summary_large_image",
    site: "@devangsaklani",
    title: "Devang Saklani | Software Engineer",
    description:
      "At rooms.saklani.dev you can create a private chat room and share data across multiple devices, the chat room will automatically delete after 15min.",
    image:
      "https://res.cloudinary.com/dyn3sdtfm/image/upload/v1663470958/og1_l965qv.webp",
    imageAlt: "Devang Saklani | Software Engineer",
  }}
/>
