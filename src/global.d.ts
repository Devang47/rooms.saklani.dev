interface Message {
  data: string;
  timestamp: string;
  device: string;
}

interface RelayMessage extends Message {
  deviceId: string;
}

interface CustomNotification {
  data: string;
  error: boolean;
}
