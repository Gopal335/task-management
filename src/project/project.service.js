import Project from '../../models/project.model.js';
import Task from '../../models/task.model.js';
import AppError from '../../utils/error.js';

export const createProject = async (data) => {
  return await Project.create(data);
};

export const getProjects = async (query) => {
  const { page = 1, limit = 10, sort = '-createdAt' } = query;

  const skip = (page - 1) * limit;

  const projects = await Project.find()
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Project.countDocuments();

  return { total, projects };
};

export const getProjectById = async (id) => {
  const project = await Project.findById(id);

  if (!project) throw new AppError('Project not found', 404);

  return project;
};

export const updateProject = async (id, data) => {
  const project = await Project.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!project) throw new AppError('Project not found', 404);

  return project;
};

export const deleteProject = async (id) => {
  const project = await Project.findByIdAndDelete(id);

  if (!project) throw new AppError('Project not found', 404);
};

export const getProjectTasks = async (projectId, query) => {
  const { status } = query;

  const filter = { project: projectId };

  if (status) filter.status = status;

  return await Task.find(filter);
};

export const getProjectTaskStats = async () => {
  const stats = await Task.aggregate([
    {
      $group: {
        _id: {
          project: '$project',
          status: '$status',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: '$_id.project',
        statuses: {
          $push: {
            status: '$_id.status',
            count: '$count',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $unwind: '$project',
    },
    {
      $project: {
        _id: 0,
        projectId: '$project._id',
        projectName: '$project.name',
        statuses: 1,
      },
    },
  ]);

  return stats;
};

export const getProjectCompletionRate = async () => {
  const result = await Task.aggregate([
    {
      $group: {
        _id: '$project',
        totalTasks: { $sum: 1 },
        completedTasks: {
          $sum: {
            $cond: [{ $eq: ['$status', 'DONE'] }, 1, 0],
          },
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: '_id',
        foreignField: '_id',
        as: 'project',
      },
    },
    {
      $unwind: '$project',
    },
    {
      $project: {
        _id: 0,
        projectId: '$_id',
        projectName: '$project.name',
        totalTasks: 1,
        completedTasks: 1,
        completionRate: {
          $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100],
        },
      },
    },
  ]);

  return result;
};
