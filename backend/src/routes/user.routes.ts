import { Router } from "express";
import {
  getUser,
  listUsers,
  removeUser,
  updateUser,
} from "../controllers/user.controller";
import { requireAdmin, requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", removeUser);

export default router;
