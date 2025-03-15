import { DataType, PeerConnection } from ".";

import download from "js-file-download";
import { addNotification } from "$utils/notifications";
import {
  connectionListLoading,
  handleReceiveData,
  startPeerSession,
} from "./actions";
import { addConnectionList, removeConnectionList } from "./actions";

export const startPeer = async () => {
  try {
    connectionListLoading(true);
    const id = await PeerConnection.startPeerSession();
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
    connectionListLoading(false);
  } catch (err: any) {
    console.log(err);
    addNotification(err.message, true);
    connectionListLoading(false);
  }
};
