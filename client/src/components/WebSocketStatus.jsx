import { useEffect, useState } from "react";

const WebSocketStatus = () => {
  const [status, setStatus] = useState("Disconnected");

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onopen = () => setStatus("Connected");
    socket.onclose = () => setStatus("Disconnected");
    socket.onerror = () => setStatus("Error");

    return () => socket.close();
  }, []);

  const getColor = () => {
    switch (status) {
      case "Connected":
        return "bg-green-500";
      case "Error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className={`w-3 h-3 rounded-full ${getColor()}`}></div>
      <span className="text-sm text-gray-700">WebSocket: {status}</span>
    </div>
  );
};

export default WebSocketStatus;
