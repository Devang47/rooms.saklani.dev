import { notifications } from "$stores/app";
import { get } from "svelte/store";

export let addNotification = (msg: string) => {
  notifications.set([...get(notifications), { data: "404 Not found" }]);

  setTimeout(() => {
    get(notifications).pop();
    notifications.set(get(notifications));
  }, 2000);
};
