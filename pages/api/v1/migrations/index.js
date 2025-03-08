import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.options);

async function getHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return response.status(200).json(pendingMigrations);
}

async function postHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  const responseStatus = migratedMigrations.length > 0 ? 201 : 200;
  return response.status(responseStatus).json(migratedMigrations);
}
