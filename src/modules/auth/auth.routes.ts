import { Router } from "express";
import controller from "./auth.controller";

const router = Router();

router.post("/sign-up", controller.signUp);
router.post("/confirm-sign-up", controller.confirmSignUp);
router.post("/resend-code", controller.resendCode);
router.post("/sign-in", controller.signIn);
router.post("/refresh-token", controller.refreshToken);

export default router;
