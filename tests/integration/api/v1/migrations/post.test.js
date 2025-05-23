import { clearDatabase, waitForAllServices } from "tests/orquestrator";

beforeAll(async () => {
  await waitForAllServices();
  await clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the 1st time", async () => {
        const response1 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response1.status).toBe(201);

        const response1Body = await response1.json();

        expect(Array.isArray(response1Body)).toBeTruthy();
        expect(response1Body.length).toBeGreaterThan(0);
      });

      test("For the 2nd time", async () => {
        const response2 = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();

        expect(Array.isArray(response2Body)).toBeTruthy();
        expect(response2Body.length).toEqual(0);
      });
    });
  });
});
