import type { User } from "firebase/auth";
import type Peer from "peerjs";
import { writable } from "svelte/store";

export const roomId = writable<string>();
export const roomMessages = writable<any>([]);
export let loading = writable<boolean>(true);
export let loadingUpload = writable<boolean>(false);
export let notifications = writable<CustomNotification[]>([]);
export let user = writable<User>();
export let roomData = writable<any>(false);

export let peerInstance = writable<Peer>();

export const initialState = {
  id: undefined,
  loading: false,
  list: [],
  selectedId: undefined,
  started: false,
};

export const connectionState = writable<{
  readonly id?: string;
  readonly started: boolean;
  readonly loading: boolean;
  readonly list: string[];
  readonly selectedId?: string;
}>(initialState);

export const currentUserVideoRef = writable<HTMLVideoElement>();
export const remoteUserVideoRef = writable<HTMLVideoElement>();
export const videoCallDialogOpen = writable<boolean>(false);

export const relayMessages = writable<Map<string, RelayMessage[]>>(new Map());
