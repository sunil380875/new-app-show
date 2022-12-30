module.exports = (handleAsyncError) => (req, res, next) => {
  Promise.resolve(handleAsyncError(req, res, next)).catch(next);
};
