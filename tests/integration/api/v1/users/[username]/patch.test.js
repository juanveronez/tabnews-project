import { version as uuidVersion } from "uuid";
import user from "models/user";
import password from "models/password";

import orquestrator from "tests/orquestrator";

beforeAll(async () => {
  await orquestrator.waitForAllServices();
  await orquestrator.clearDatabase();
  await orquestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("With duplicated 'username'", async () => {
      await orquestrator.createUser({
        username: "user1",
      });

      await orquestrator.createUser({
        username: "user2",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user1", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With duplicated 'email'", async () => {
      const { username } = await orquestrator.createUser({
        email: "email1@email.com",
      });

      await orquestrator.createUser({
        email: "email2@email.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "email2@email.com",
          }),
        },
      );

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar esta operação.",
        status_code: 400,
      });
    });

    test("With nonexistent username", async () => {
      const response = await fetch(
        "http://localhost:3000/api/v1/users/nonexistent",
        { method: "PATCH" },
      );

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });

    test("With unique 'username'", async () => {
      const { email } = await orquestrator.createUser({
        username: "user",
      });

      const response = await fetch("http://localhost:3000/api/v1/users/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "updatedUser",
        }),
      });

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "updatedUser",
        email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      const createdAt = Date.parse(responseBody.created_at);
      const updatedAt = Date.parse(responseBody.updated_at);

      expect(createdAt).not.toBeNaN();
      expect(updatedAt).not.toBeNaN();

      expect(updatedAt > createdAt).toBe(true);
    });

    test("With unique 'email'", async () => {
      const { username } = await orquestrator.createUser({
        email: "email@email.com",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "updatedEmail@email.com",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username,
        email: "updatedEmail@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      const createdAt = Date.parse(responseBody.created_at);
      const updatedAt = Date.parse(responseBody.updated_at);

      expect(createdAt).not.toBeNaN();
      expect(updatedAt).not.toBeNaN();

      expect(updatedAt > createdAt).toBe(true);
    });

    test("With new 'password'", async () => {
      const { username, email } = await orquestrator.createUser({
        password: "password",
      });

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${username}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: "updatedPassword",
          }),
        },
      );

      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username,
        email,
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);

      const createdAt = Date.parse(responseBody.created_at);
      const updatedAt = Date.parse(responseBody.updated_at);

      expect(createdAt).not.toBeNaN();
      expect(updatedAt).not.toBeNaN();

      expect(updatedAt > createdAt).toBe(true);

      const userInDatabase = await user.findOneByUsername(username);

      const newPasswordMatch = await password.compare(
        "updatedPassword",
        userInDatabase.password,
      );

      const oldPasswordMatch = await password.compare(
        "password",
        userInDatabase.password,
      );

      expect(newPasswordMatch).toBe(true);
      expect(oldPasswordMatch).toBe(false);
    });
  });
});
