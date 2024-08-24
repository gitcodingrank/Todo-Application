const express = require("express");
const { userController } = require("../Controller/user.controller");
const  { userAuthController } = require("../Controller/userAuth.controller")
const { authT } = require("../Middleware/authenticate");

let userRouter = express.Router();

// Register a new user
userRouter.post("/register", userController.registerUser);
// Get a user by ID
userRouter.get("/:id",authT, userController.getUserById);
// Get all users
userRouter.get("/",authT, userController.getAllUsers);
// Update a user by ID
userRouter.put("/:id",authT, userController.updateUserById);
// Delete a user by ID
userRouter.delete("/:id",authT, userController.deleteUserById);
//User Login
userRouter.post("/login", userAuthController.login);
//User Logout
userRouter.post("/logout", userAuthController.logout);

module.exports = { userRouter };
