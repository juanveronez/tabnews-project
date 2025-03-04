import { waitForAllServices } from "tests/orquestrator";

beforeAll(async () => {
  await waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/status");
      expect(response.status).toBe(200);

      const { updated_at, dependencies } = await response.json();

      expect(updated_at).toBeDefined();

      const parsedUpdatedAt = new Date(updated_at).toISOString();
      expect(updated_at).toEqual(parsedUpdatedAt);

      const { version, max_connections, opened_connections } =
        dependencies.database;

      expect(version).toEqual("16.0");
      expect(max_connections).toEqual(100);
      expect(opened_connections).toEqual(1);
    });
  });
});
