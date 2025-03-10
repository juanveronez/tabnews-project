import database from "infra/database";
import { ValidationError } from "infra/errors";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const result = await database.query(
      `
        SELECT email FROM users
        WHERE LOWER(email) = LOWER($1)
      `,
      [email],
    );

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar o cadastro.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const result = await database.query(
      `
        SELECT username FROM users 
        WHERE LOWER(username) = LOWER($1)
      `,
      [username],
    );

    if (result.rowCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar o cadastro.",
      });
    }
  }

  async function runInsertQuery({ username, email, password }) {
    const result = await database.query(
      `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [username, email, password],
    );

    return result.rows[0];
  }
}

const user = {
  create,
};

export default user;
