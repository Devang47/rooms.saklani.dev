import { writable } from "svelte/store";

export const roomId = writable<string>();
export const roomMessages = writable<any>();
