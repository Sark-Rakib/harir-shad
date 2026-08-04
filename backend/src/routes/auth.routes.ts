import { Router } from "express";
import {
  login,
  logout,
  me,
  register,
  updateMe,
} from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.put("/me", requireAuth, updateMe);

export default router;
