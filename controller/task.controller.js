import Task from "../models/task.js";

export const createTask = async (req, res) => {
    const { title, status } = req.body;
    try {
        const task = await Task.create({ title, status, userId: req.user.id });
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;
    try {
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({ message: "Task not found" });

        task.title = title || task.title;
        task.status = status || task.status;
        await task.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}