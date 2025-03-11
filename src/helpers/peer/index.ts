import Peer, { type DataConnection, PeerErrorType, PeerError } from "peerjs";
import { addNotification } from "../../utils/notifications";
import { generateRandomName } from "$utils";

let activeConnectionsMap: Map<string, DataConnection> = new Map<
  string,
  DataConnection
>();

export enum DataType {
  FILE = "FILE",
  MESSAGE = "MESSAGE",
}

export interface Data {
  dataType: DataType;
  timestamp: string;
  deviceId: string;
  message?: string;
  file?: Blob;
  fileName?: string;
  fileType?: string;
}

let peer: Peer | undefined;

export const PeerConnection = {
  getPeer: () => peer,
  startPeerSession: () =>
    new Promise<string>((resolve, reject) => {
      try {
        const id = generateRandomName();
        peer = new Peer(id, {
          host: import.meta.env.VITE_PEERJS_HOST,
          port: import.meta.env.VITE_PEERJS_PORT,
        });
        peer.on("open", (id) => {
          console.log("My ID: " + id);
          resolve(id);
        });
        peer.on("error", (err) => {
          console.log(err);
          addNotification(err.message, true);
        });
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  closePeerSession: () =>
    new Promise<void>((resolve, reject) => {
      try {
        if (peer) {
          peer.destroy();
          peer = undefined;
        }
        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    }),
  connectPeer: (id: string) =>
    new Promise<void>((resolve, reject) => {
      if (!peer) {
        reject(new Error("Peer hasn't started yet"));
        return;
      }
      if (activeConnectionsMap.has(id)) {
        reject(new Error("Connection existed"));
        return;
      }
      try {
        let conn = peer.connect(id, { reliable: true });
        if (!conn) {
          reject(new Error("Connection can't be established"));
        } else {
          conn
            .on("open", function () {
              console.log("Connect to: " + id);
              activeConnectionsMap.set(id, conn);
              peer?.removeListener("error", handlePeerError);
              resolve();
            })
            .on("error", function (err) {
              console.log(err);
              peer?.removeListener("error", handlePeerError);
              reject(err);
            });

          // When the connection fails due to expiry, the error gets emmitted
          // to the peer instead of to the connection.
          // We need to handle this here to be able to fulfill the Promise.
          const handlePeerError = (err: PeerError<`${PeerErrorType}`>) => {
            if (err.type === "peer-unavailable") {
              const messageSplit = err.message.split(" ");
              const peerId = messageSplit[messageSplit.length - 1];
              if (id === peerId) reject(err);
            }
          };
          peer.on("error", handlePeerError);
        }
      } catch (err) {
        reject(err);
      }
    }),
  onIncomingConnection: (callback: (conn: DataConnection) => void) => {
    peer?.on("connection", function (conn) {
      console.log("Incoming connection: " + conn.peer);
      activeConnectionsMap.set(conn.peer, conn);
      callback(conn);
    });
  },
  onConnectionDisconnected: (id: string, callback: () => void) => {
    if (!peer) {
      throw new Error("Peer hasn't started yet");
    }
    if (!activeConnectionsMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    let conn = activeConnectionsMap.get(id);
    if (conn) {
      conn.on("close", function () {
        console.log("Connection closed: " + id);
        activeConnectionsMap.delete(id);
        callback();
      });
    }
  },
  sendConnection: (id: string, data: Data): Promise<void> =>
    new Promise((resolve, reject) => {
      if (!activeConnectionsMap.has(id)) {
        reject(new Error("Connection didn't exist"));
      }
      try {
        let conn = activeConnectionsMap.get(id);
        if (conn) {
          conn.send(data);
        }
      } catch (err) {
        reject(err);
      }
      resolve();
    }),
  onConnectionReceiveData: (id: string, callback: (f: Data) => void) => {
    if (!peer) {
      throw new Error("Peer hasn't started yet");
    }
    if (!activeConnectionsMap.has(id)) {
      throw new Error("Connection didn't exist");
    }
    let conn = activeConnectionsMap.get(id);
    if (conn) {
      conn.on("data", function (receivedData) {
        console.log("Receiving data from " + id);
        let data = receivedData as Data;
        callback(data);
      });
    }
  },
};
