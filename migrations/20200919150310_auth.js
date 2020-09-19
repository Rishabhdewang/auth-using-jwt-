
exports.up = function(knex) {
    return knex.schema.createTable("auth1", (t1) => {
        t1.increments("id");
        t1.string("Email").notNullable();
        t1.string("Password").notNullable();
        t1.boolean("isEmailVerified");
    })
  
};

exports.down = function(knex) {
        return knex.schema.dropTableIfExists("auth1");
};
