import { Router } from "express";
import controller from "./hubspot.controller";

const router = Router();

router.get("/company", controller.getCompanyByEmail);
router.get(
  "/company/:companyId/appointments",
  controller.getCompanyAppointments,
);
router.get("/company/:companyId/metrics", controller.getCompanyLeadMetrics);

export default router;
