import openSocket from "socket.io-client";

const socket = openSocket("http://localhost:5000");

function wsEmit(action, data) {
  socket.emit(action, data);
}

function wsReceive(action, cb) {
  socket.on(action, msg => {
    cb(msg);
  });
}

export { wsEmit, wsReceive };
