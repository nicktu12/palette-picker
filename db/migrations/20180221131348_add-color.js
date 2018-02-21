exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("palettes", table => {
      table.string("color6");
    })
  ]); // end promise.all
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("palettes", table => {
      table.dropColumn("color6");
    })
  ]);
};
