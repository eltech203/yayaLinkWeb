import io from "socket.io-client";

export default ({ store }, inject) => {
  const socket = io(process.env.SOCKET_URL || "http://localhost:3000");

  socket.on("connect", () => {
    console.log("🔌 Connected to socket server");

    const uid = store.state.auth?.uid;
    if (uid) {
      socket.emit("join", uid);
    }
  });

  socket.on("notification", (data) => {
    console.log("🔔 Notification:", data);

    store.dispatch("notifications/add", data);
  });

  inject("socket", socket);
};
