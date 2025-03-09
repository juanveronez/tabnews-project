/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder }
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("users", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    username: {
      // For reference, GitHub limits usernames to 39 characters.
      type: "varchar(30)",
      notNull: true,
      unique: true,
    },
    email: {
      // Why 254 characters? https://stackoverflow.com/a/1199238
      type: "varchar(254)",
      notNull: true,
      unique: true,
    },
    password: {
      // Why 72 characters? https://security.stackexchange.com/a/39851
      type: "varchar(72)",
      notNull: true,
    },
    created_at: {
      // Why timestamp with time zone https://justatheory.com/2012/04/postgres-use-timestamptz/
      type: "timestamptz",
      default: pgm.func("now()"),
    },
    updated_at: {
      // Why timestamp with time zone https://justatheory.com/2012/04/postgres-use-timestamptz/
      type: "timestamptz",
      default: pgm.func("now()"),
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = false;
