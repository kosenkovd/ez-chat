import openSocket from "socket.io-client";

const port = process.env.PORT || 5000;
const socket = openSocket("http://localhost:" + port);

function wsEmit(action, data) {
  socket.emit(action, data);
}

function wsReceive(action, cb) {
  socket.on(action, msg => {
    cb(msg);
  });
}

export { wsEmit, wsReceive };
