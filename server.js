const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.palettes = [
  { id: 'a1', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] },
  { id: 'a2', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] },
];
app.locals.projects = [{id: 'test'}];

app.get('/', (request, response) => {
  response.send(`What's good palette people?`);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.get('/api/v1/palettes', (request, response) => {
  const palettes = app.locals.palettes;

  response.status(200).json({ palettes })
});

app.get('/api/v1/projects', (request, response) => {
  const projects = app.locals.projects;

  response.status(200).json({ projects });
})

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  // implement md5 for unique id
  
  const { palette } = request.body;

  app.locals.palettes.push(palette);

  response.status(201).json({ id, palette });
});

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();

  const { project } = request.body;

  app.locals.projects.push(project);
  response.status(201).json({ id, project });
})
