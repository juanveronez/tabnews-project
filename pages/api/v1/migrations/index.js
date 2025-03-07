import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { getNewClient } from "infra/database";
import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.options);

const defaultMigrationOptions = {
  dir: resolve("infra", "migrations"),
  migrationsTable: "pgmigrations",
  direction: "up",
  verbose: true,
  dryRun: true,
};

async function getHandler(request, response) {
  let dbClient;

  try {
    dbClient = await getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  let dbClient;

  try {
    dbClient = await getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    const responseStatus = migratedMigrations.length > 0 ? 201 : 200;
    return response.status(responseStatus).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}
