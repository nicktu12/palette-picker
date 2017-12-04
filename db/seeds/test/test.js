
exports.seed = function(knex, Promise) {
  return knex('palettes').del() // deletes all projects
    .then(()=> knex('projects').del()) // deletes all palettes
    .then(()=>{
      return Promise.all([
        knex('projects').insert({
          name: 'My First Project',
          id: 1
        }, 'id') // inserts a single project
          .then(project => {
            return knex('palettes').insert([
              {
                name: 'My first palette',
                color1: '#dd0d0d',
                color2: '#ff00f4',
                color3: '#f07272',
                color4: '#a90091',
                color5: '#0078c1',
                projectId: 1,
                id: 1
              },
              {
                name: 'Cotton Candy',
                color1: '#135D1D',
                color2: '#8AF105',
                color3: '#7946B2',
                color4: '#27CCB6',
                color5: '#874D5E',
                projectId: 1,
                id: 2
              }
            ]);
          }) // inserts palettes into our mock projects
          .then(()=>console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]); // end of promise.all
    }) // end of .then
    .catch(error => console.log(`Error seeding data: ${error}`));
};
