const { exec } = require("node:child_process");

function checkPostgres() {
  //   pg_isready returns ready early if not use `--host localhost`
  // because the command assume OK when the connection is available using Socket UNIX (ocurr first than TCP/IP)
  // localhost works because is a TCP/IP alias to 127.0.0.1

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(_, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\n🟢 Postgres pronto e aceitando conexões.");
  }
}

process.stdout.write("\n\n🔴 Aguardando Postgres aceitar conexões");
checkPostgres();
