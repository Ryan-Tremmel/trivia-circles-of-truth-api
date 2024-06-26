/* Explanation: catchAsync receives a function, the async function, which then in turn receives three parameters...
req, res, next. Async functions return promises, in this case queries, which are either returned successfully or rejected...
If there is an error in the async function, it is rejected and can be catched...
catchAsync will return another function which is assigned to createTour, which can then later be called when necessary and not immediately.
 If we return a function, then Express will call that function with req, res and next. We in turn can pass those variables to fn(req, res, next). */

module.exports = catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err => next(err));
  };
};
