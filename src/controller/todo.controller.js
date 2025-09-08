const Todo = require("../models/todo.model")

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(todos);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.getTodos = async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);

        if (!todo) return res.status(404).json({ message: "Todo not found" });

        // Ownership check
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.createTodo = async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    try {
        const todo = new Todo({
            title,
            description,
            user: req.user.id,
        })
        await todo.save()
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
        console.log(error);
    }
}

exports.updateTodo = async (req, res) => {

    try {
        const todoId = req.params.id;
        const { title, description, completed } = req.body;

        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        // Ownership check
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }

        todo.title = title;
        todo.description = description;
        todo.completed = completed;

        await todo.save();

        return res.status(200).json({
            message: "Todo updated successfully",
            todo,
            success: true,
        });


    } catch (error) {
        console.error("Error updating item:", error);
        return res.status(500).json({
            message: "Something went wrong while updating item",
            error: error.message,
            success: false,
        });
    }


}

exports.deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.id;
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        // Ownership check
        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await todo.deleteOne();
        return res.status(200).json({
            message: "Todo deleted successfully",
            todo,
            success: true,
        });
    } catch (error) {
        console.error("Error deleting item:", error);
        return res.status(500).json({
            message: "Something went wrong while deleting item",
            error: error.message,
            success: false,
        });
    }
}
