const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    // Default values
    message: err.message || "Something went wrong, please try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // Duplicate Error
  if (err.code && err.code == 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose a different value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Validation Error
  if (err.name == "ValidationError") {
    customError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Cast Error (wrong id format)
  if (err.name == "CastError") {
    customError.message = `No item with id ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // console.log(err);
  return res.status(customError.statusCode).json(customError.message);
};

module.exports = errorHandlerMiddleware;
