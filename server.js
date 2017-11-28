const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.palettes = [
  { id: 'a1', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] },
  { id: 'a2', palette: ['color1', 'color2', 'color3', 'color4', 'color5'] },
];

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

app.post('/api/v1/palettes', (request, response) => {
  const id = Date.now();
  // implement md5 for unique id
  
  const { palette } = request.body;

  app.locals.palettes.push(message);

  response.status(201).json({ id, message });
});
