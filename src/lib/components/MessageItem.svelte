<script lang="ts">
  import { onMount } from "svelte";
  import CryptoJS from "crypto-js";
  import { decrypt } from "$helpers/crypt";
  import { addNotification } from "$utils/notifications";
  import { scale } from "svelte/transition";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { connectionState } from "$stores";

  export let messageData: RelayMessage;
  export let roomId = "";
  export let encrypted = false;

  console.log({ messageData });

  let sameDevice = false;
  let message = "";

  onMount(async () => {
    if (!encrypted) {
      message = messageData.data;
      sameDevice = messageData.deviceId === $connectionState.id;
      return;
    }

    const currentDeviceDetails = CryptoJS.SHA256(navigator.userAgent).toString(
      CryptoJS.enc.Hex
    );

    if (currentDeviceDetails === messageData.device) {
      sameDevice = true;
    }

    const cryptedKey = CryptoJS.SHA512(roomId).toString(CryptoJS.enc.Hex);

    message = decrypt(cryptedKey, messageData.data);
  });

  let done = false;
  const copyText = () => {
    navigator.clipboard.writeText(message);
    done = true;
    addNotification("Copied to clipboard!", false);
  };
</script>

<div
  class="message-item"
  transition:scale={{ start: 0.9, opacity: 0.8 }}
  class:right-aligned={sameDevice}
  class:left-aligned={!sameDevice}
>
  <p class="w-full font-medium">{message}</p>

  <button
    aria-label="copy text"
    class:done
    on:click={copyText}
    title="copy text"
    class="copy-btn"
  >
    <div class="sr-only">copy text</div>
    <CopyIcon />
  </button>
</div>
