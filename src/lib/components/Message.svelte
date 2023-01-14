<script lang="ts">
  import { onMount } from "svelte";
  import CryptoJS from "crypto-js";
  import { decrypt } from "$utils/crypt";
  import { addNotification, formatMessage } from "$utils/notifications";
  import { fade, fly, scale } from "svelte/transition";
  import CodeInput from "./CodeInput.svelte";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import { formatLinks } from "$utils/format";

  export let messageData: Message;
  export let roomId = "";

  let sameDevice = false;
  let message = "";

  onMount(async () => {
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
  <p class="w-full font-medium">
    {@html formatLinks(message)}
  </p>

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
