import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { getNewClient } from "infra/database";

const allowedMethods = ["GET", "POST"];

export default async function migrations(request, response) {
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed.`,
    });
  }

  let dbClient;

  try {
    dbClient = await getNewClient();

    const defaultMigrationOptions = {
      dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
      verbose: true,
      dryRun: true,
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      const responseStatus = migratedMigrations.length > 0 ? 201 : 200;
      return response.status(responseStatus).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
