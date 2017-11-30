
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', (table)=>{
      table.increments('id').primary();
      table.string('name').unique();
      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', (table)=>{
      table.increments('id').primary();
      table.string('name');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');
      table.string('color5');
      table.integer('projectId').unsigned();
      table.foreign('projectId').references('projects.id');
      table.timestamps(true, true);
    })
  ]) // end promise.all  
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};
