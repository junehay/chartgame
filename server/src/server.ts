import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import { sequelize } from './models';
import redis from 'redis';
import connectRedis from 'connect-redis';
import { v4 as uuidv4 } from 'uuid';
import cookieParser from 'cookie-parser';
import socketIo from 'socket.io';
import config from './config/config';
import api from './routes/api';
import admin from './routes/admin';
import logger, { stream } from './config/logger';

const app: Application = express();
const client: redis.RedisClient = redis.createClient(6379, process.env.REDIS_HOST);
const redisStore = connectRedis(session);

sequelize
  .sync()
  .then(() => console.log('connected to db'))
  .catch((err) => {
    console.log(err);
  });

// middleware
app.use(
  session({
    secret: config.SECRET_KEY as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60
    },
    store: new redisStore({ client: client })
  })
);
if (process.env.NODE_ENV === 'production') {
  app.use(
    helmet({
      contentSecurityPolicy: false
    })
  );
  app.use(morgan('combined', { stream: stream }));
} else {
  app.use(morgan('dev'));
}
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(config.SECRET_KEY));

// session setting
app.use((req, res, next) => {
  if (req.session !== undefined) {
    req.session.uuid ? '' : (req.session.uuid = uuidv4());
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
app.use((req, res) => {
  res.status(404).json('ERR_NOT_FOUND');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  res.status(500).json({
    message: err.message || 'ERR_UNKNOWN_ERROR'
  });
});

// server
const options = {
  host: process.env.NODE_HOST || 'localhost',
  port: process.env.NODE_PORT || 3001
};

const server = app.listen(options, () => console.log(`server on!!! ${options.host}:${options.port}`));

// socket.io
const io = socketIo(server);

interface socket {
  name: string;
  socketNum: number;
  message: string;
}

io.sockets.on('connection', (socket: socketIo.Socket & socket) => {
  let socketNum: number = Object.keys(io.sockets.sockets).length;
  socket.on('newUser', (name: string) => {
    socket.name = name;
    socket.socketNum = socketNum;
    io.sockets.emit('update', {
      type: 'connect',
      message: `${name}님이 입장하셨습니다.`
    });
    socket.emit('socketNum', socketNum);
    socket.broadcast.emit('socketNum', socketNum);
  });

  socket.on('message', (data: socket) => {
    data.name = socket.name;
    socket.emit('socketNum', socketNum);
    socket.broadcast.emit('update', data);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('update', {
      type: 'disconnect',
      message: `${socket.name}님이 퇴장하셨습니다.`
    });
    --socketNum;
    socket.emit('socketNum', socketNum);
    socket.broadcast.emit('socketNum', socketNum);
  });
});
