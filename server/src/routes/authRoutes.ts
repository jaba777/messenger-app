import express, { Router } from "express";
import {
  registerController,
  loginController,
  getUser,
  searchUsers,
  getRoom,
  getRooms,
  getMessages,
  sendMessage,
} from "../controllers/authController";

const router: Router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user", getUser);
router.get("/search/:keyword", searchUsers);
router.post("/room", getRoom);
router.get("/rooms/:id", getRooms);
router.post("/messages", getMessages);
router.post("/message/:roomId/:userId", sendMessage);

export default router;
