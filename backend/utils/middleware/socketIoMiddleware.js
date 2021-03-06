const socketIo = require("socket.io");
const log = require("../console-alert");
const {
  addUser,
  getCurrentUser,
  getUsersInRoom,
  removeUser,
} = require("../chatRooms");

const socketIOConfig = (server) => {
  const io = socketIo(server);

  const boardIo = io.of("chat");
  boardIo.on("connect", (socket) => {
    const { name, room = "main" } = socket.handshake.query;

    socket.on("join", () => {
      log.success(`${name} has joined the room!!`);
      const { user, error } = addUser({ id: socket.id, name, room });

      if (error) return error;

      socket.emit("message", {
        user: user.name,
        text: `You are connected, to ${room} room.`,
        time: Date.now(),
      });

      socket.broadcast.to(user.room).emit("message", {
        user: user.name,
        text: `Joined the room.`,
      });

      socket.join(user.room);

      boardIo.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getCurrentUser(socket.id);

      if (!user) return callback("User not found");

      const newMessage = {
        user: user.name,
        text: message,
        time: Date.now(),
        room: user.room,
      };
      boardIo.to(user.room).emit("message", newMessage);

      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
        const newMessage = {
          user: user.name,
          text: `Has left the room!.`,
          time: Date.now(),
        };
        boardIo.to(user.room).emit("message", newMessage);

        boardIo.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });

        log.warning(`${user.name}, has left!!`);
      }
    });
  });
};

module.exports = { socketIOConfig };
