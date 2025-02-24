import { Client } from "pg";

export async function query(queryObject, queryValues) {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production",
  });

  try {
    await client.connect();

    const result = await client.query(queryObject, queryValues);

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
}
