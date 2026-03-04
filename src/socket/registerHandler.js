const postulatesSocket = require("./module/postulates.socket");

module.exports = (io, socket) => {
    console.log("Registering handlers for socket 👽👽", socket.id);
    postulatesSocket(io, socket);
}