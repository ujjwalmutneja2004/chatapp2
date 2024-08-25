// const notFound = (req, res, next) => {
//     const error = new Error(`Not Found - $(req.originalUrl)`);
//     res.status(404);
//     next(error);
//     //next function passes error to next middleware function
// }

// const errorHandler = (err, req, res, next) => {
//     const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//         message:err.message,
//         stack:process.env.NODE_ENV==="production"?null:err.stack,
//     });
// };

// module.exports = { notFound, errorHandler }


const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the next middleware
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Correctly use res.statusCode

    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack, // Hide stack trace in production
    });
};

module.exports = { notFound, errorHandler };
