export const validateTodoCreation = (data: any) => {
  if (!data || typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error('Title is required and must be a non-empty string.');
  }
  return true;
};
