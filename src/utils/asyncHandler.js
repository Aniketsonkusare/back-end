// const asyncHandler = (fn) => async(req,res,next) => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: true,
//             messege: error.messege
//         })
//     }
// }

// export {asyncHandler}

const asyncHandler = (fun) => {
  return (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch((err) => next(err));
  };
};

export {asyncHandler};
