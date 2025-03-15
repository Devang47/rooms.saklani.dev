import { connectionState, initialState, loading, relayMessages } from "$stores";
import { addNotification } from "$utils/notifications";
import { DataType, PeerConnection, type Data } from ".";
import download from "js-file-download";

export const startPeerSession = (id: string) => {
  connectionState.update((state) => {
    return { ...state, id: id, started: true };
  });
};

export const stopPeerSession = () => {
  connectionState.set(initialState);
};

export const connectionListLoading = (loading: boolean) => {
  connectionState.update((state) => {
    return { ...state, loading };
  });
};

export const removeConnectionList = (id: string) => {
  connectionState.update((state) => {
    let newList = state.list.filter((item) => item !== id);
    if (state.selectedId === id) {
      if (newList.length === 0) {
        return { ...state, list: newList, selectedId: undefined };
      } else {
        return { ...state, list: newList, selectedId: newList[0] };
      }
    }
    return { ...state, list: newList };
  });
};

export const addConnectionList = (id: string) => {
  connectionState.update((state) => {
    let newList = [...state.list, id];

    if (newList.length === 1) {
      return { ...state, list: newList, selectedId: id };
    }

    return { ...state, list: [...state.list, id] };
  });
};

export const selectConnection = (id: string) => {
  connectionState.update((state) => {
    return { ...state, selectedId: id };
  });
};

export const connectPeer = async (id: string) => {
  try {
    await PeerConnection.connectPeer(id);
    PeerConnection.onConnectionDisconnected(id, () => {
      addNotification("Connection closed: " + id, false);
      removeConnectionList(id);
    });
    PeerConnection.onConnectionReceiveData(id, (data) => {
      handleReceiveData(data, id);
    });
    addConnectionList(id);
  } catch (err: any) {
    addNotification(err.message, true);
  }
  loading.set(false);
};

export const handleReceiveData = (data: Data, id: string) => {
  if (data.dataType === DataType.FILE) {
    if (
      window.confirm(
        "Do you want to download file " + data.fileName + " from " + id + "?"
      )
    ) {
      addNotification("Receiving file " + data.fileName + " from " + id);
      download(data.file || "", data.fileName || "fileName", data.fileType);
    }
  } else {
    relayMessages.update((msgs) => {
      msgs.set(data.deviceId, [
        ...(msgs.get(data.deviceId) ?? []),
        {
          data: data.message ?? "",
          deviceId: data.deviceId,
          timestamp: data.timestamp,
          device: data.deviceId,
        },
      ]);

      return msgs;
    });
  }
};
