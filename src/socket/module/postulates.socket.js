module.exports = (io, socket) => {

    socket.on("join-module", (module) => {
        console.log("User joined module 👽👽", module);
        const room = `module:${module}`;
        socket.join(room);
    })

    socket.on("new-postulate", (postulate) => {
        console.log("New postulate", postulate);
        const room = `module:${postulate.moduleId}`;
        io.to(room).emit("new-postulate", postulate);
    })

    socket.on("update-postulate", (postulate) => {
        console.log("Update postulate", postulate);
        const room = `module:${postulate.moduleId}`;
        io.to(room).emit("update-postulate", postulate);
    })

    socket.on("leave-module", (module) => {
        console.log("User left module", module);
        const room = `module:${module}`;
        socket.leave(room);
    })

}