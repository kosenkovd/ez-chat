const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const path = require("path");

const port = 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Array of currently online users
const onlineUsers = [];

io.on("connection", socket => {
  socket.on("join", data => {
    socket.join(data.room);

    // Adding user to online array
    const newOnlineUser = {
      login: data.login,
      room: data.room,
      id: socket.id
    };
    onlineUsers.push(newOnlineUser);

    // Creating system message
    const timesent = formatTime();
    const message = {
      login: "Admin",
      message: `${data.login} вошел в комнату пользователя ${data.room}!`,
      timesent
    };
    io.in(data.room).emit("message", message);

    // Creating array of online users to send to client side
    let onlineToOut = [];
    onlineUsers.forEach(elem => {
      if (elem.room === data.room) {
        onlineToOut.push(elem.login);
      }
    });
    io.in(data.room).emit("online", onlineToOut);
  });

  socket.on("message", data => {
    io.in(data.room).emit("message", data.msg);
  });

  socket.on("disconnect", data => {
    let offlineUser;
    let offlineIndex;
    let room;

    // Finding login and room of logged out user
    onlineUsers.forEach((elem, index) => {
      if (elem.id === socket.id) {
        offlineUser = elem.login;
        offlineIndex = index;
        room = elem.room;
        return;
      }
    });

    // Checking if such a user was found and telling client side who logged out
    if (offlineIndex) {
      onlineUsers.splice(offlineIndex, 1);
      io.in(room).emit("offline", offlineUser);
    }
  });
});

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Formating current time into string like HH:MM:SS
function formatTime() {
  const now = new Date();
  let hours = now.getHours();
  if (hours < 10) {
    hours = "0" + String(hours);
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = "0" + String(minutes);
  }
  let seconds = now.getSeconds();
  if (seconds < 10) {
    seconds = "0" + String(seconds);
  }
  return `${hours}:${minutes}:${seconds}`;
}
