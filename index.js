const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const dbUrl = process.env.MONGO_URI;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);
const gameRouter = require('./routes/gameRouter');
app.use('/game', gameRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(`ERROR => ${err}`);
  res.send(err);
});

io.on('connection', (socket) => {
  console.log(`client ${socket.id}  connected.`);
  try {
    socket.emit('enter', 'Welcome! You are connected.');
    socket.on('test', (data) => {
      console.log(data);
    });
  } catch (error) {
    console.error(error);
  }
  socket.on('disconnect', () => {
    console.log(`client ${socket.id}  disconnected.`);
  });
});

const pollingInterval = 30 * 1000; // 5 seconds

const initSocket = (io) => {
  const interval = setInterval(() => {
    console.log('*** Test emitted! ***');
    io.emit('test', 'Testing socket');
  }, pollingInterval);
};

initSocket(io);

// Start the server
async function init() {
  try {
    const connection = await mongoose.connect(dbUrl, {
      dbName: 'galaxy-smashers',
    });
    if (connection.connections[0].host) {
      console.log('Connected to DB');
      server.listen(PORT, () => {
        console.log('Listening on port ' + PORT);
      });
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

init();
