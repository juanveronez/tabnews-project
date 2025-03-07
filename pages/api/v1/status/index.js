import { createRouter } from "next-connect";
import { query } from "infra/database";
import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();

  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
  const publicError = new InternalServerError({ cause: error });

  console.log("\nErro dentro do catch do controller:");
  console.log(publicError);

  response.status(500).json(publicError);
}

async function getHandler(_, response) {
  const updatedAt = new Date().toISOString();

  const versionResult = await query("SHOW server_version;");
  const version = versionResult.rows[0].server_version;

  const maxConnectionsResult = await query("SHOW max_connections;");
  const maxConnections = parseInt(maxConnectionsResult.rows[0].max_connections);

  const openedConnectionsResult = await query(
    "SELECT COUNT(*)::INT FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB],
  );
  const openedConnections = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version,
        max_connections: maxConnections,
        opened_connections: openedConnections,
      },
    },
  });
}
