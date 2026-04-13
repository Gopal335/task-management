import { AppError } from '../../utils/error.js';

describe('AppError', () => {
  test('should create error correctly', () => {
    const error = new AppError('Test error', 400);

    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(400);
  });
});
