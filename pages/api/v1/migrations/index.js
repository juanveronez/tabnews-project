import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import { getNewClient } from "infra/database";

export default async function migrations(request, response) {
  const dbClient = await getNewClient();

  const defaultMigrationOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    migrationsTable: "pgmigrations",
    direction: "up",
    verbose: true,
    dryRun: true,
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);

    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });

    await dbClient.end();
    const responseStatus = migratedMigrations.length > 0 ? 201 : 200;
    return response.status(responseStatus).json(migratedMigrations);
  }

  await dbClient.end();
  return response.status(405).end();
}
