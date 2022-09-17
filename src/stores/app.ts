import { writable } from "svelte/store";

export const roomId = writable<string>();
export const roomMessages = writable<any>([]);
export let loading = writable<boolean>(true);
export let notifications = writable<CustomNotification[]>([]);
