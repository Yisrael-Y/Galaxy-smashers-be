const { host, port, dbUrl, corsOptions } = require('./config');
const app = require('express')();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: corsOptions,
});
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

// Middleware
app.use(
  cors({
    origin: corsOptions.origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', routes);

// Error handler
app.use((err, req, res, next) => {
  console.log(`ERROR => ${err}`);
  res.send(err);
});

const room = {};
io.on('connection', (socket) => {
  console.log(`[connected] Client id: ${socket.id}`);
  try {
    socket.on('join', (data) => {
      room[socket.id] = data;
      socket.join(room);

      console.log(`[join] Client id: ${socket.id} joined room ${room}`);
    });

    // Handle chat event
    socket.on('chat', (chatMsg) => {
      console.log('chat', chatMsg);
      console.log(socket.handshake.query);
      io.emit('chat', chatMsg);
    });

    // Handle typing event
    socket.on('typing', (data) => {
      socket.broadcast.emit('typing', data);
    });
  } catch (error) {
    console.error(error);
  }
  socket.on('disconnect', () => {
    Object.keys(room).find((key) => {
      room[key] === socket.id && delete room[key];
    });

    console.log(`[disconnected] Client id: ${socket.id}`);
  });
});

// Start the server
(async function init() {
  try {
    const connection = await mongoose.connect(dbUrl, {
      dbName: 'galaxy-smashers',
    });
    if (connection.connections[0].host) {
      console.log('Connected to DB');
      server.listen(port, () => {
        console.log('Listening on port ' + port);
      });
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
