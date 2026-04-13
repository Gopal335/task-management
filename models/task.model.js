import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Relation to Project
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },

    // Assigned user
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Task status
    status: {
      type: String,
      enum: ['TODO', 'IN_PROGRESS', 'DONE'],
      default: 'TODO',
    },

    // Optional: priority system
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },

    // Deadline support
    dueDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes (VERY IMPORTANT for filtering & analytics)
 */
taskSchema.index({ project: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ createdAt: -1 });

export default mongoose.model('Task', taskSchema);
