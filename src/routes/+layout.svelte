<script lang="ts">
  import Notification from "$lib/sections/Notifications.svelte";
  import LoadingScreen from "$lib/sections/LoadingScreen.svelte";
  import { loading, user } from "$stores/app";
  import SvelteSeo from "svelte-seo";
  import { partytownSnippet } from "@builder.io/partytown/integration";
  import { onMount } from "svelte";
  import { signInAnonymously } from "firebase/auth";
  import "$styles/global.scss";
  import { auth } from "$utils/config";
  import { addNotification } from "$utils/notifications";

  // Add the Partytown script to the DOM head
  let scriptEl: any;
  onMount(() => {
    if (scriptEl) {
      scriptEl.textContent = partytownSnippet();
    }

    signInAnonymously(auth)
      .then((authUser) => {
        user.set(authUser.user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        addNotification(errorMessage, true);
      });
  });
</script>

<svelte:head>
  <script>
    partytown = {
      forward: ["dataLayer.push"],
      resolveUrl: (url) => {
        const siteUrl = "https://rooms.saklani.dev/proxytown";
        return url;
      },
    };
  </script>

  <script bind:this={scriptEl}></script>
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
