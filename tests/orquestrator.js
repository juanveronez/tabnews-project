import retry from "async-retry";

import { query } from "infra/database";

export async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000, // This add timeout was used to don't allow async-retry to scale timeout, by default is an exp.
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      // response.ok: status between 200-299
      if (!response.ok) {
        throw Error();
      }
    }
  }
}

export async function clearDatabase() {
  await query("DROP SCHEMA public CASCADE; CREATE SCHEMA public");
}
