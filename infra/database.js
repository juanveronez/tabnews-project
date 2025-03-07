import { Client } from "pg";
import { ServiceError } from "./errors";

export async function getNewClient() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    ssl: getSSL(),
  });
  await client.connect();
  return client;
}

export async function query(queryObject, queryValues) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject, queryValues);

    return result;
  } catch (error) {
    const serviceError = new ServiceError({
      message: "Erro no conexão com o Banco de Dados ou na Query.",
      cause: error,
    });
    throw serviceError;
  } finally {
    await client?.end();
  }
}

function getSSL() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }
  return process.env.NODE_ENV === "production";
}
