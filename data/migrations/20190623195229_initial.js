
exports.up = async function(knex) {
    await knex.schema.createTable('users', users => {
      users.increments();
  
      users
        .string('username', 128)
        .notNullable()
        .unique();
      users.string('password', 128).notNullable();
      users.integer('numRounds');
      users.string('salt', 64);
    });
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
  };