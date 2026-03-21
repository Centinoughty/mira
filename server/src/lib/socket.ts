import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuth } from "../middlewares/socketAuth";
import { AuthenticatedSocket } from "../types/request";

const userSocketMap = new Map<string, string>();

let io: Server;

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: [process.env.CLIENT_URL!],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket: Socket) => {
    const userId = (socket as AuthenticatedSocket).user.id;
    userSocketMap.set(userId, socket.id);
    console.log(`User connected ${userId}`);

    socket.on("disconnect", () => {
      userSocketMap.delete(userId);
      console.log(`User disconnected ${userId}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
}

export function notifyUser(userId: string, event: string, data: unknown) {
  const socketId = userSocketMap.get(userId);
  if (socketId) {
    getIO().to(socketId).emit(event, data);
  }
}
