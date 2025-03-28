import { notifications } from "$stores";
import { get } from "svelte/store";

export let addNotification = (
  msg: string,
  error: boolean = false,
  timeout?: number,
) => {
  notifications.set([...get(notifications), { data: msg, error }]);

  setTimeout(() => {
    get(notifications).shift();
    notifications.set(get(notifications));
  }, timeout ?? 2000);
};
