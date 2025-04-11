import { Schema, model } from "mongoose";

const pomodoroPointSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStreakUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const PomodoroPoint = model("PomodoroPoint", pomodoroPointSchema);
