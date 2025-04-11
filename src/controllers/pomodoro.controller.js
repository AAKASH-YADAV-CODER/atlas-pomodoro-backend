import { Pomodoro } from "../../models/15TimeMethods/pomodoro.model.js";
const pomodoroController = {
  // Create a new pomodoro task
  createPomodoro: async (req, res) => {
    try {
      const { text, deadline, priority, reminderInterval } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (!text) {
        return res
          .status(400)
          .json({ success: false, message: "Task name is required" });
      }

      const pomodoro = await Pomodoro.create({
        userId,
        text: text || "",
        deadline,
        priority: priority || "medium",
        reminderInterval,
      });

      return res.status(201).json({
        success: true,
        data: pomodoro,
        message: "Pomodoro task created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create pomodoro task",
      });
    }
  },

  // Get all pomodoro tasks for a user
  getAllPomodoros: async (req, res) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const pomodoros = await Pomodoro.find({ userId });

      return res.status(200).json({
        success: true,
        data: pomodoros,
        message: "Pomodoro tasks retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get pomodoro tasks",
      });
    }
  },

  // Get a single pomodoro task by ID
  getPomodoroById: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const pomodoro = await Pomodoro.findOne({ _id: id, userId });

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: pomodoro,
        message: "Pomodoro task retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get pomodoro task",
      });
    }
  },

  // Update a pomodoro task
  updatePomodoro: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;
      const updateData = req.body;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      // Remove fields that shouldn't be updated
      delete updateData.userId;
      delete updateData._id;

      const pomodoro = await Pomodoro.findOneAndUpdate(
        { _id: id, userId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: pomodoro,
        message: "Pomodoro task updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update pomodoro task",
      });
    }
  },

  // Delete a pomodoro task
  deletePomodoro: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const pomodoro = await Pomodoro.findOneAndDelete({ _id: id, userId });

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: {},
        message: "Pomodoro task deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete pomodoro task",
      });
    }
  },

  // Update progress of a pomodoro task
  updateProgress: async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      if (progress < 0 || progress > 100) {
        return res.status(400).json({
          success: false,
          message: "Progress must be between 0 and 100",
        });
      }

      const pomodoro = await Pomodoro.findOneAndUpdate(
        { _id: id, userId },
        { progress },
        { new: true, runValidators: true }
      );

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: pomodoro,
        message: "Progress updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update progress",
      });
    }
  },

  // Mark pomodoro as completed
  markAsCompleted: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      const pomodoro = await Pomodoro.findOneAndUpdate(
        { _id: id, userId },
        { completed: true, progress: 100 },
        { new: true }
      );

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: pomodoro,
        message: "Pomodoro marked as completed",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to mark pomodoro as completed",
      });
    }
  },

  // Update deadline of a pomodoro task
  updateDeadline: async (req, res) => {
    try {
      const { id } = req.params;
      const { deadline } = req.body;
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      // Validate deadline is at least 5 minutes in the future
      if (deadline) {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
        const minDeadlineDate = new Date(currentDate.getTime() + 5 * 60000); // 5 minutes from now

        if (deadlineDate < minDeadlineDate) {
          return res.status(400).json({
            success: false,
            message: "Deadline must be at least 5 minutes in the future",
          });
        }
      }

      const pomodoro = await Pomodoro.findOneAndUpdate(
        { _id: id, userId },
        { deadline },
        // new: true - returns the updated document instead of the original one
        // runValidators: true - runs validation checks on the update operation
        { new: true, runValidators: true }
      );

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }

      return res.status(200).json({
        success: true,
        data: pomodoro,
        message: "Deadline updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update deadline",
      });
    }
  },
};

export default pomodoroController;
