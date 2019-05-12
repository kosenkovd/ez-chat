import openSocket from "socket.io-client";

const custom = parseInt(window.location.search.replace("?", ""), 10);
console.log(custom);
console.log(process.env.PORT);
const port = custom || process.env.PORT || 5000;
const socket = openSocket(`http://localhost:${port}`);

function wsEmit(action, data) {
  socket.emit(action, data);
}

function wsReceive(action, cb) {
  socket.on(action, msg => {
    cb(msg);
  });
}

export { wsEmit, wsReceive };
