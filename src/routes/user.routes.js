import { Router } from "express";
import { userAuthentication } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlerwares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/signup", userAuthentication.signupUser);
router.post("/login", userAuthentication.loginUser);

// Protected routes
router.use(verifyJWT); // Apply middleware to all routes below
router.post("/logout", userAuthentication.logoutUser);
router.get("/users", userAuthentication.getAllUsers);
export default router;
