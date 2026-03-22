import { Router } from "express";
import controller from "./lead.controller";

const router = Router();

router.get("/user/:userId", controller.getAllLeads);
router.get("/:id", controller.getLead);
router.post("/", controller.createLead);
router.put("/:id", controller.updateLead);
router.delete("/:id", controller.deleteLead);

export default router;
