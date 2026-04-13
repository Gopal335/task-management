import AppError from './error.js';

export const validateRequired = (fields, body) => {
  for (let field of fields) {
    if (!body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }
};
