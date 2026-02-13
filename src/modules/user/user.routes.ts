import { Router } from "express";

import controller from "./user.controller";

const router = Router();

router.get("/:email", controller.getUser);
router.post("/", controller.createUser);

export default router;
