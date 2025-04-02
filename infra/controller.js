import {
  InternalServerError,
  MethodNotAllowedError,
  ValidationError,
  NotFoundError,
} from "./errors";

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();

  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.log(publicError);
  response.status(publicError.statusCode).json(publicError);
}

const controller = {
  options: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
