const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());
require("dotenv").config();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
  },
});

const router = require("./src/routes/index");
app.use(express.json());
// Load router paths
app.use("/api", router);

const db = require("./src/models/index");

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

/**
 * web socket listeners and actions
 */

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

const messageService = require('./src/services/messages.service');
io.on('connection', (socket) => {
    console.log('a user connected');
    const users = [];
    for (let [id, socket] of io.of("/").sockets) {
        console.log('socket', socket)
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    console.log('users', users)
    socket.on('add_message', (message) => {
        console.log(message);
        const {
            message_from,
            message_to,
           // message,
        } = message;
        //messageService.addMessage(message_from, message_to, message);
        io.emit('get_message', message);
    });
    socket.on('get_message', (message) => {
        console.log(message);
        io.emit('get_message', message);
    });
  }
  console.log("users", users);
  socket.on("add_message", (message) => {
    console.log(message);

    const {
      message_from,
      message_to,
      message_content,
      discussion,
      message_parent,
    } = message;

    messageService.addMessage(
      message_from,
      message_to,
      message_content,
      discussion,
      message_parent
    );
    io.emit("get_message", message);
  });
  socket.on("get_message", (message) => {
    console.log(message);
    io.emit("get_message", message);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
  });
});

io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

// set port, listen for requests
const PORT = normalizePort(process.env.PORT || '8000');
server.listen(PORT, () => {
  console.log("Server is running");
});

const dbConfig = require("./src/config/db.config.js");

const Sequelize = require("sequelize");
const createError = require("http-errors");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
