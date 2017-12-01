const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/public'));

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';

app.get('/', (request, response) => {
  response.send(`What's good palette people?`);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send(
        { error: 
          `Expected format: { name: <String> }.` + 
          `You are missing a "${requiredParameter}" property.` });
    } 
  }

  database('projects').insert(project, 'id')
    .then(project=>{
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  console.log(palette);
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId']){
    if(!palette[requiredParameter]){
      return response.status(422).send({ 
        error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, projectId: <Integer> }. You're missing a "${requiredParameter}" property.` 
      })
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette=>{
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects=>{
      return response.status(200).json(projects);
    })
    .catch(error =>{
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  const { id } = request.params;

  database('palettes').where({ projectId: id }).select()
    .then(palettes=>{
      return response.status(200).json(palettes);
    })
    .catch(error =>{
      response.status(500).json({ error });
    });
});

//app.get('/api/v1/projects', (request, response) => {
//  const projects = app.locals.projects;
//
//  response.status(200).json({ projects });
//})
//
//app.post('/api/v1/palettes', (request, response) => {
//  const id = Date.now();
//  // implement md5 for unique id
//  
//  const { palette } = request.body;
//
//  app.locals.palettes.push(palette);
//
//  response.status(201).json({ id, palette });
//});
//
//app.post('/api/v1/projects', (request, response) => {
//  const id = Date.now();
//
//  const { project } = request.body;
//
//  app.locals.projects.push(project);
//  response.status(201).json({ id, project });
//})
//
module.exports = app;
