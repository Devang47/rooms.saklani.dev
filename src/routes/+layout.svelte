<script lang="ts">
  import Notifications from "$lib/sections/Notifications.svelte";
  import LoadingScreen from "$lib/sections/LoadingScreen.svelte";
  import { loading, user } from "$stores";
  import SvelteSeo from "svelte-seo";
  import { onMount } from "svelte";
  import { signInAnonymously } from "firebase/auth";
  import "$styles/global.scss";
  import { auth } from "$utils/config";
  import { addNotification } from "$utils/notifications";

  onMount(() => {
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

{#if $loading}
  <LoadingScreen />
{/if}

<Notifications />

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
