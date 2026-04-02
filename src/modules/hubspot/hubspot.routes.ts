import { Router } from "express";
import controller from "./hubspot.controller";

const router = Router();

router.get("/company", controller.getCompanyByEmail);
router.get("/company/contacts", controller.getCompanyContacts);

export default router;
