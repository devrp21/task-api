import Task from "../models/task.js";

export const createTask = async (req, res) => {
    const { title, status } = req.body;
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    try {
        const task = await Task.create({ title, status, UserId: req.user.id });
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { UserId: req.user.id } });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getTaskById = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ where: { id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTask = async (req, res) => {
    const { id } = req.params;
    const { title, status } = req.body;
    try {
        const task = await Task.findOne({ where: { id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: "Task not found" });
        if (title !== undefined) task.title = title;
        if (status !== undefined) task.status = status;
        await task.save();
        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTask = async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findOne({ where: { id, UserId: req.user.id } });
        if (!task) return res.status(404).json({ message: "Task not found" });
        await task.destroy();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};