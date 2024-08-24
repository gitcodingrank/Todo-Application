const Todo = require("../Model/todo.model");
const User = require("../Model/user.model");

let todoController = {
    createTodo: async (req, res) => {
        try {
            const { task, priority, userId } = req.body;

            let fetchedUser = await User.findById(userId);
            if (!fetchedUser) {
                return res.status(404).json({ msg: "User not found" });
            }

            let todo = new Todo({
                task,
                status: false,
                priority,
                addedBy: fetchedUser.name,
                user: userId // Storing only userId
            });

            let savedTodo = await todo.save();

            await User.updateOne(
                { _id: userId },
                { $push: { todos: savedTodo._id } }
            );

            return res.status(201).json({ msg: "Todo created successfully" });

        } catch (error) {
            console.error("Error creating todo:", error);
            return res.status(400).json({ errors: error.message });
        }
    },

    getTodoById: async (req, res) => {
        const { id } = req.params;

        try {
            let todo = await Todo.findById(id);
            if (!todo) {
                return res.status(404).json({ msg: "Todo not found" });
            }

            return res.status(200).json(todo);

        } catch (error) {
            console.error("Error fetching todo:", error);
            return res.status(500).json({ errors: error.message });
        }
    },

    getAllTodos: async (req, res) => {
        try {
            let todos = await Todo.find();
            return res.status(200).json(todos);

        } catch (error) {
            console.error("Error fetching todos:", error);
            return res.status(500).json({ errors: error.message });
        }
    },

    getAllTodosByUserId: async (req, res) => {
        const { userId } = req.body;

        try {
            let todos = await Todo.find({ user: userId });
            return res.status(200).json(todos);

        } catch (error) {
            console.error("Error fetching todos by userId:", error);
            return res.status(500).json({ errors: error.message });
        }
    },

    deleteTodoById: async (req, res) => {
        const { id } = req.params;

        try {
            let todo = await Todo.findByIdAndDelete(id);
            if (!todo) {
                return res.status(404).json({ msg: "Todo not found" });
            }

            // Also remove the todo ID from the user's todos list
            await User.updateOne(
                { todos: id },
                { $pull: { todos: id } }
            );

            return res.status(200).json({ msg: "Todo deleted successfully" });

        } catch (error) {
            console.error("Error deleting todo:", error);
            return res.status(500).json({ errors: error.message });
        }
    },

    updateTodoById: async (req, res) => {
        const { id } = req.params;
        const updateData = req.body;

        try {
            let todo = await Todo.findByIdAndUpdate(id, updateData);
            if (!todo) {
                return res.status(404).json({ msg: "Todo not found" });
            }

            return res.status(200).json({ msg: "Todo updated successfully", todo });

        } catch (error) {
            console.error("Error updating todo:", error);
            return res.status(400).json({ errors: error.message });
        }
    },

    toggleTodoStatusById: async (req, res) => {
        const { id } = req.params;

        try {
            // Find the todo by ID
            let todo = await Todo.findById(id);
            if (!todo) {
                return res.status(404).json({ msg: "Todo not found" });
            }

            // Log the current status for debugging
            console.log(`Current status of todo with id ${id}: ${todo.completed}`);

            // Toggle the completed status
            todo.status = !todo.status;

            // Save the updated todo
            let updatedTodo = await todo.save();

            // Log the updated status for debugging
            console.log(`Updated status of todo with id ${id}: ${updatedTodo.completed}`);

            return res.status(200).json({ msg: "Todo status updated successfully", todo: updatedTodo });

        } catch (error) {
            console.error("Error toggling todo status:", error);
            return res.status(500).json({ errors: error.message });
        }
    }
};

module.exports = { todoController };
