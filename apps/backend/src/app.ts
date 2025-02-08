import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import chatSocket from "../../chat/src/controllers/chatController.ts";
import dotenv from "dotenv";
import authRouter, { init } from "../src/controllers/authController";
import cors from "cors";
import isLoggedin from "./middlewares/authMiddleware.ts";
dotenv.config();

init();
const app = express();
app.use(authRouter);
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}))
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }, // Allow all origins (change as needed)
});
chatSocket(io);
app.get("/", isLoggedin, (_req: any, res: any) => {
  res.send("Hello World!");
});
console.log("Server running on port 5000");
app.listen(3000);


app.get("/", isLoggedin, (_req: any, res: any) => {
  res.send("Hello World!");
});

app.get("/test", (req, res) => {
  res.redirect("com.example.chapterly:/");
})