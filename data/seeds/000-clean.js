
// save as 000-clean.js so it run first

const cleaner = require('knex-cleaner');

exports.seed = async knex => {
  // DELETES ALL existing entries
  await cleaner.clean(knex, {
    mode: 'delete',
    ignoreTables:[
      "users",    // DO NOT wipe out users table
      "knex_migrations",
      "knex_migrations_lock"
    ]
  })
};