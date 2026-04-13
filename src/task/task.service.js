import Task from '../../models/task.model.js';
import AppError from '../../utils/error.js';

export const createTask = async (data) => {
  return await Task.create(data);
};

export const getTasks = async (query) => {
  const { status, assignedTo, user, project, page = 1, limit = 10 } = query;

  const filter = {};

  if (status) filter.status = status;
  if (assignedTo || user) filter.assignedTo = assignedTo || user;
  if (project) filter.project = project;

  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter).skip(skip).limit(Number(limit));

  const total = await Task.countDocuments(filter);

  return { total, tasks };
};

export const getTaskById = async (id) => {
  const task = await Task.findById(id);

  if (!task) throw new AppError('Task not found', 404);

  return task;
};

export const updateTask = async (id, data) => {
  const task = await Task.findByIdAndUpdate(id, data, { new: true });

  if (!task) throw new AppError('Task not found', 404);

  return task;
};

export const deleteTask = async (id) => {
  const task = await Task.findByIdAndDelete(id);

  if (!task) throw new AppError('Task not found', 404);
};

export const updateTaskStatus = async (id, status) => {
  if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const task = await Task.findByIdAndUpdate(id, { status }, { new: true });

  if (!task) throw new AppError('Task not found', 404);

  return task;
};

export const assignTask = async (id, userId) => {
  const task = await Task.findByIdAndUpdate(
    id,
    { assignedTo: userId },
    { new: true }
  );

  if (!task) throw new AppError('Task not found', 404);

  return task;
};

export const getTopUsers = async () => {
  const users = await Task.aggregate([
    {
      $group: {
        _id: '$assignedTo',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: { completedTasks: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$user',
    },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        totalTasks: 1,
        completedTasks: 1,
      },
    },
  ]);

  return users;
};
