const express = require("express");
const { todoController } = require("../Controller/todo.controller");
const { authT } = require("../Middleware/authenticate");

let todoRouter = express.Router();

// Create a new todo
todoRouter.post("/create", authT, todoController.createTodo);
// Get a todo by ID
todoRouter.get("/:id", authT, todoController.getTodoById);
// Get all todos
todoRouter.get("/", authT, todoController.getAllTodos);
// Get all todos by user ID
todoRouter.post("/byUser", authT, todoController.getAllTodosByUserId);
// Delete a todo by ID
todoRouter.delete("/:id", authT, todoController.deleteTodoById);
// Update a todo by ID
todoRouter.put("/:id", authT, todoController.updateTodoById);
// Toggle todo status by ID
todoRouter.patch("/:id/toggleStatus", authT, todoController.toggleTodoStatusById);

module.exports = { todoRouter };
