require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
let db = require("./db/db");
const db_op = require("./database_operations");
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + "/public"))
   .use(express.static(__dirname + "/assets"))
   .use(express.static(__dirname + "/db"))
   .get("/", (req, res) => res.sendFile(path.join(__dirname, "/views/index.html")));


io.on("connection", socket => {
   socket.on("change-username", username => {
      db = db_op.add_user(username, socket.id, db);
   });

   socket.on("message-send", (sender, receiver, data) => {
      socket.to(db.users[receiver]).emit("message-recieve", sender, data);
      console.log(sender, receiver, data);
   });
});


server.listen(PORT, () => console.log(`Listening on port: ${PORT}`));