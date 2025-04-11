import { Router } from "express";
import { userAuthentication } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/signup", userAuthentication.signupUser);
router.post("/login", userAuthentication.loginUser);
router.post("/verify-email", userAuthentication.verifyEmail);
router.post("/forgot-password", userAuthentication.forgotPassword);
router.post("/reset-password/:token", userAuthentication.resetPassword);
router.post("/google-auth", userAuthentication.googleAuth);

// Protected routes
router.use(verifyJWT); // Apply middleware to all routes below
router.post("/logout", userAuthentication.logoutUser);
router.get("/me", userAuthentication.getCurrentUser);
router.get("/users", userAuthentication.getAllUsers);
router.post("/update-points", userAuthentication.updateTaskPoints);

router.post("/increase-normal-coins", userAuthentication.increaseNormalCoins);
router.post("/increase-gold-coins", userAuthentication.increaseGoldCoins);
router.post("/increase-elite-coins", userAuthentication.increaseEliteCoins);
router.post(
  "/convert-normal-coins",
  userAuthentication.convertNormalCoinsToCoupon
);
router.post("/convert-gold-coins", userAuthentication.convertGoldCoinsToCoupon);
router.post(
  "/convert-elite-coins",
  userAuthentication.convertEliteCoinsToCoupon
);
export default router;
