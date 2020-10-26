const express = require('express');
const app = express();
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const redis = require('redis');
const client = redis.createClient('6379', process.env.REDIS_HOST);
const redisStroe = require('connect-redis')(session);
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const socketIo = require('socket.io');
const config = require('./config/config.js');
const api = require('./routes/api.js');
const admin = require('./routes/admin.js');
const logger = require('./config/logger');
const { cli } = require('winston/lib/winston/config');

// middleware
app.use(
  session({
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    store: new redisStroe({client: client})
  })
);
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.SECRET_KEY));

// session setting
app.use((req, res, next) => {
  if (!req.session.uuid) {
    req.session.uuid = uuidv4();
  }
  next();
});

// router
app.use('/api', api);
app.use('/api/admin', admin);

// react build
app.get('*', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  } else {
    next();
  }
});

// error handler
app.use((req, res, next) => {
  res.status(404).send('404errrrrrr');
});

app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'unknown error'
  });
});

// server
const options = {
  host: process.env.NODE_HOST || 'localhost',
  port: process.env.NODE_PORT || 3001,
};

const server = app.listen(options, () =>
  console.log(`server on!!! ${options.host}:${options.port}`)
);

// socket.io
const io = socketIo(server);

let numUsers = 0;

io.sockets.on('connection', (socket) => {
  socket.on('newUser', (name) => {
    socket.name = name;
    ++numUsers;
    socket.numUsers = numUsers;
    io.sockets.emit('update', {
      type: 'connect',
      message: `${name}님이 입장하셨습니다.`,
    });
    socket.emit('numUsers', numUsers);
    socket.broadcast.emit('numUsers', numUsers);
  });

  socket.on('message', (data) => {
    data.name = socket.name;
    socket.broadcast.emit('update', data);
  });

  socket.on('disconnect', () => {
    if (numUsers > 0) {
      --numUsers;
      socket.broadcast.emit('update', {
        type: 'disconnect',
        message: `${socket.name}님이 퇴장하셨습니다.`,
      });
      socket.emit('numUsers', numUsers);
      socket.broadcast.emit('numUsers', numUsers);
    }
  });
});