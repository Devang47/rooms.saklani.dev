<script lang="ts">
  import Notification from "$lib/sections/Notifications.svelte";
  import LoadingScreen from "$lib/sections/LoadingScreen.svelte";
  import { loading } from "$stores/app";
  import SvelteSeo from "svelte-seo";

  import "$styles/global.scss";
</script>

<svelte:head>
  <!-- Google tag (gtag.js) -->
  <!-- <script
    async
    src="https://www.googletagmanager.com/gtag/js?id=G-3Y8ZTH1T0T"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());

    gtag("config", "G-3Y8ZTH1T0T");
  </script> -->
</svelte:head>

{#if $loading}
  <LoadingScreen />
{/if}

<Notification />

<slot />

<SvelteSeo
  title="Chat Rooms | Devang Saklani"
  description="At rooms.saklani.dev you can create a private chat room and share data across multiple devices, the chat room will automatically delete after 15min.."
  openGraph={{
    type: "website",
    title: "Chat Rooms | Devang Saklani",
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
