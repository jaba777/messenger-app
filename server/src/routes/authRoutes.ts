import express, { Router } from "express";
import {
  registerController,
  loginController,
  getUser,
  searchUsers,
  getRoom,
  getRooms,
} from "../controllers/authController";

const router: Router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/user", getUser);
router.get("/search/:keyword", searchUsers);
router.post("/room", getRoom);
router.get("/rooms/:id", getRooms);

export default router;
