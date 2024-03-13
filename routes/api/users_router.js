import express from "express";
import userController from "../../controllers/user_controllers.js"
import { validateBody } from "../../decorators/index.js";
import { authenticate, isEmptyBody, upload } from "../../middlewares/index.js";
import { userUpdateSchema } from "../../models/User.js";

const userRouter = express.Router();

userRouter.get("/:userId", authenticate, validateBody(userUpdateSchema), userController.currentUser);

userRouter.patch("/:userId", authenticate, isEmptyBody, validateBody(userUpdateSchema), userController.updateUser);

userRouter.post("/forgot-password", isEmptyBody, userController.forgotPassword);

export default userRouter;