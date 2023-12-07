const express = require("express");
const bodyParser = require("body-parser");
const Message = require("./models/chatmodel");
const User = require("./models/usermodel");
const app = express();
//for change the normal api to websocketAPI
const cors = require("cors");
const socketPort = 8000;
const { emit } = require("process");
const server = require("http").createServer(app);
const io = require("socket.io")(server);

//Get socket function api
const {
  getSocketMessages,
  createSocketMessage,
} = require("./controllers/chatcontroller");

app.use(cors());

const { connectDb } = require("./config/database");
const port = 3000;

//routes
const chat = require("./routes/chatroutes");
const user = require("./routes/userroutes");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/api/chat", chat);
app.use("/api/user", user);

connectDb();

app.get("/", (request, response) => {
  response.json({ info: "Our app is up and running" });
});

const emitMostRecentMessges = () => {
  getSocketMessages()
    .then((result) => io.emit("chat message", result))
    .catch(console.log);
};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("chat message", (msg) => {
    const msgObj = JSON.parse(msg);
    console.log(msgObj);
    createSocketMessage(msgObj)
      .then(() => {
        emitMostRecentMessges();
      })
      .catch((err) => io.emit(err));
  });
});

io.on("disconnect", () => {
  console.log("user disconnected");
});

app.listen(port, () => {
  console.log(`App running on ${port}.`);
});

server.listen(socketPort, () => {
  console.log(`listening on *:${socketPort}`);
});
