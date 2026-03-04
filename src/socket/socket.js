const { Server } = require("socket.io");
const registerHandler = require("./registerHandler");

let io;

exports.initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected 👽👽", socket.id);


        registerHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });

    return io;
}

exports.getIO = () => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
}