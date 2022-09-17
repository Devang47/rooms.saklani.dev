<script lang="ts">
  import { onMount } from "svelte";
  import CryptoJS from "crypto-js";
  import { decrypt } from "$utils/crypt";

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
</script>

<div class="message-item" class:left-aligned={sameDevice}>
  <p class="w-full">
    {message}
  </p>
</div>
