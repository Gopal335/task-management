import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // Owner of the project
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Team members
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Optional: for analytics & quick lookup
    taskCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Indexes (IMPORTANT for performance)
 */
projectSchema.index({ owner: 1 });
projectSchema.index({ members: 1 });

export default mongoose.model('Project', projectSchema);
