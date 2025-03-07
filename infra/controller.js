import { InternalServerError, MethodNotAllowedError } from "./errors";

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();

  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
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
