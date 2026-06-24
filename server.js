const http = require("http");
const { Server } = require("socket.io");

const createApp = require("./app");
const app = createApp();
const server = http.createServer(app);
const io = new Server(server);


app.set("io", io);

io.on("connection", (socket) => {
    console.log("Cliente conectado");
});

server.listen(3000, () => {
    console.log("Servidor iniciado en puerto 3000");
});