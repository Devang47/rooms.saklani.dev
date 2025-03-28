import { PeerConnection } from ".";
import { addNotification } from "$utils/notifications";
import {
  connectionListLoading,
  handleReceiveData,
  startPeerSession,
} from "./actions";
import { addConnectionList, removeConnectionList } from "./actions";

export const startPeer = async () => {
  let timeout: NodeJS.Timeout | null = null;
  try {
    timeout = setTimeout(() => {
      addNotification(
        "The server is taking some time to start. Please wait...",
        false,
        4000,
      );
    }, 5000);

    connectionListLoading(true);

    const id = await PeerConnection.startPeerSession();

    clearTimeout(timeout);
    timeout = null;

    PeerConnection.onIncomingConnection((conn) => {
      const peerId = conn.peer;
      addNotification("Incoming connection: " + peerId);
      addConnectionList(peerId);

      PeerConnection.onConnectionDisconnected(peerId, () => {
        addNotification("Connection closed: " + peerId);
        removeConnectionList(peerId);
      });
      PeerConnection.onConnectionReceiveData(peerId, (data) => {
        handleReceiveData(data, id);
      });
    });

    startPeerSession(id);
  } catch (err: any) {
    console.log(err);
    addNotification(err.message, true);
    connectionListLoading(false);
  } finally {
    if (timeout) {
      clearTimeout(timeout);
    }
  }
  connectionListLoading(false);
};
