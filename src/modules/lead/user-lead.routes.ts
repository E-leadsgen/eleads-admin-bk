import { Router } from "express";
import controller from "./user-lead.controller";

const router = Router();

router.get("/user/:userId", controller.getUserLeadsByUserId);
router.get("/:id", controller.getUserLead);
router.post("/", controller.createUserLead);
router.put("/:id", controller.updateUserLead);
router.delete("/:id", controller.deleteUserLead);

export default router;
