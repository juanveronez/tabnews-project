import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default async function migrations(request, response) {
  if (["GET", "POST"].includes(request.method)) {
    const dryRun = request.method === "GET";

    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dir: join("infra", "migrations"),
      migrationsTable: "pgmigrations",
      direction: "up",
      verbose: true,
      dryRun,
    });

    return response.status(200).json(migrations);
  }

  return response.status(405).end();
}
