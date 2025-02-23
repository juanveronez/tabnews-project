import { query } from "../../../../infra/database";

async function status(_, response) {
  const result = await query("SELECT 1 + 1 AS sum;");
  console.log(result.rows);
  response.status(200).json({ mensagem: "A aplicação parece saudável!" });
}

export default status;
