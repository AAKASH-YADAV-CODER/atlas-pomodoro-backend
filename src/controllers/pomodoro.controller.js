import { Pomodoro } from "../models/pomodoro.model.js";
import { PomodoroPoint } from "../models/pomodoroPoint.model.js";
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

      // Check if user has PomodoroPoint data, if not create it
      let pomodoroUser = await PomodoroPoint.findOne({ userId });
      if (!pomodoroUser) {
        pomodoroUser = await PomodoroPoint.create({
          userId,
          points: 0,
          level: 1,
          streak: 0,
          lastStreakUpdate: new Date(),
        });
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

  // Get all pomodoro points tasks for a user
  getAllPomodorosPoints: async (req, res) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "User not authenticated" });
      }

      let pomodoroPoints = await PomodoroPoint.findOne({ userId });

      // If no points data exists, create it
      if (!pomodoroPoints) {
        pomodoroPoints = await PomodoroPoint.create({
          userId,
          points: 0,
          level: 1,
          streak: 0,
          lastStreakUpdate: new Date(),
        });
      }

      return res.status(200).json({
        success: true,
        data: pomodoroPoints,
        message: "Pomodoro Points retrieved successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get pomodoro points",
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

      const pomodoro = await Pomodoro.findOne({ _id: id, userId });
      let pomodoroPoints = await PomodoroPoint.findOne({ userId });

      if (!pomodoro) {
        return res
          .status(404)
          .json({ success: false, message: "Pomodoro task not found" });
      }
      if (!pomodoroPoints) {
        return res.status(404).json({
          success: false,
          message: "Pomodoro User for Point update not found",
        });
      }

      // Update points and check for level up
      const currentPoints = pomodoroPoints.points || 0;
      const newPoints = currentPoints + 20; // Add 20 points for completing a task
      const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

      // Check and update streak
      const now = new Date();
      const lastUpdate = pomodoroPoints.lastStreakUpdate || now;
      const daysSinceLastUpdate = Math.floor(
        (now - lastUpdate) / (1000 * 60 * 60 * 24)
      );

      let newStreak = pomodoroPoints.streak || 0;
      let streakBonus = 0;

      if (daysSinceLastUpdate === 1) {
        // Increment streak if last update was yesterday
        newStreak += 1;
        // Check for 7-day streak bonus
        if (newStreak % 7 === 0) {
          streakBonus = 30; // Add 30 points for 7-day streak
        }
      } else if (daysSinceLastUpdate > 1) {
        // Reset streak if more than one day has passed
        newStreak = 1;
      }

      // Update the pomodoro task
      const updatedPomodoro = await Pomodoro.findOneAndUpdate(
        { _id: id, userId },
        {
          completed: true,
          progress: 100,
        },
        { new: true }
      );

      // Update the pomodoro points
      const updatedPomodoroPoint = await PomodoroPoint.findOneAndUpdate(
        { userId },
        {
          points: newPoints + streakBonus,
          level: newLevel,
          streak: newStreak,
          lastStreakUpdate: now,
        },
        { new: true }
      );
      await updatedPomodoroPoint.save();

      return res.status(200).json({
        success: true,
        data: {
          pomodoro: updatedPomodoro,
          points: updatedPomodoroPoint,
          streakBonus,
          levelUp: newLevel > pomodoroPoints.level,
        },
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
