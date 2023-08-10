// подключаем express
const express = require('express');
// подключаем http
const http = require('http');
// Импортируем сервер
const { Server } = require('socket.io');
// подключаем cors
const cors = require('cors');
// устанавливаем зависимость
const app = express();

const route = require('./route');
const { addUser, findUser, getRoomUsers, removeUser } = require('./users');

// middleware
app.use(cors({ origin: '*' }));
app.use(route);

// создаем сервер
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket => {
  socket.on('join', ({ name, room }) => {
    socket.join(room);

    const { user, isExist } = addUser({ name, room });

    const userMessage = isExist ? `${user.name}, here you go again` : `Hey my love ${user.name}`;

    socket.emit('message', {
      data: { user: { name: 'Admin' }, message: userMessage },
    });

    socket.broadcast.to(user.room).emit('message', {
      data: { user: { name: 'Admin' }, message: `${user.name} has joined` },
    });

    io.to(user.room).emit('joinRoom', {
      data: { users: getRoomUsers(user.room) },
    });
  });

  socket.on('sendMessage', ({ message, params }) => {
    const user = findUser(params);

    if (user) {
      io.to(user.room).emit('message', { data: { user, message } });
    }
  });

  socket.on('leftRoom', ({ params }) => {
    const user = removeUser(params);

    if (user) {
      const { room, name } = user;

      io.to(room).emit('message', {
        data: { user: { name: 'Admin' }, message: `${name} has left ` },
      });
      io.to(room).emit('room', {
        data: { users: getRoomUsers(room) },
      });
    }
  });

  io.on('disconnect', () => {
    console.log('Disconnect');
  });
});

// запуск проекта
server.listen(5000, () => {
  console.log('Server is running');
});
