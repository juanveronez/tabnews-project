export class InternalServerError extends Error {
  name = "InternalServerError";
  action = "Entre em contato com o suporte.";
  statusCode = 500;

  constructor({ cause }) {
    super("Um erro interno não esperado aconteceu.", { cause });
  }

  // .json() method use a JSON.stringify() to transform this object.
  // but only what is exposed here will be transformet to string.
  // It ocurr because `Error` class **omit all params** by default
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends Error {
  name = "MethodNotAllowedError";
  action = "Verifique se o método HTTP enviado é válido para este endpoint.";
  statusCode = 405;

  constructor() {
    super("Método não permitido para este endpoint.");
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}
