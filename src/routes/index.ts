import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import userRoutes from "../modules/user/user.routes";
import leadRoutes from "../modules/lead/lead.routes";
import userLeadRoutes from "../modules/lead/user-lead.routes";
import { authenticate, requireGroup } from "../middlewares/auth.middleware";

const router = Router();

router.use("/auth", authRoutes);
router.use("/user", authenticate(), requireGroup("eleads-admin"), userRoutes);
router.use("/lead", authenticate(), requireGroup("eleads-admin"), leadRoutes);
router.use(
  "/user-lead",
  authenticate(),
  requireGroup("eleads-admin"),
  userLeadRoutes,
);

export default router;
