import { notifications } from "$stores";
import { get } from "svelte/store";

export let addNotification = (msg: string, error: boolean = false) => {
  notifications.set([...get(notifications), { data: msg, error }]);

  setTimeout(() => {
    get(notifications).pop();
    notifications.set(get(notifications));
  }, 2000);
};
