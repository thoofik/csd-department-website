import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join student-specific room for targeted updates
      socket.on('join-student-room', (studentUSN: string) => {
        socket.join(`student-${studentUSN}`);
        console.log(`Client ${socket.id} joined room: student-${studentUSN}`);
      });

      // Leave student room
      socket.on('leave-student-room', (studentUSN: string) => {
        socket.leave(`student-${studentUSN}`);
        console.log(`Client ${socket.id} left room: student-${studentUSN}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }
  res.end();
};

export default SocketHandler;
