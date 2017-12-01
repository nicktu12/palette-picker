const express = require('express'); // express is a library on top of node that is easier that utilizing node alone
const bodyParser = require('body-parser'); // allows for the body of a post to be readable within the server
const app = express(); // creates an instance of express  

app.use(express.static(__dirname + '/public')); // express middleware that serves up static files

const environment = process.env.NODE_ENV || 'development'; // sets enviornment to development unless specific node enviornment is declared
const configuration = require('./knexfile')[environment]; // imports knex file to configure current enviornment
const database = require('knex')(configuration); // instantiates a databse we can work with by requiring knex in our configuration

app.use(bodyParser.json()); // use middleware to expect json
app.use(bodyParser.urlencoded({ extended: true })); // use middleware to allow for encoded server communication

app.set('port', process.env.PORT || 3000); // sets server port to environment variable, if not defined set to 3000
app.locals.title = 'Palette Picker'; // set title of application

app.get('/', (request, response) => {
  response.send(`What's good palette people?`);
}); // default response if static files are not served 

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
}); // listens to specified port and logs to terminal 

app.post('/api/v1/projects', (request, response) => { // defines endpoint to add projects to database
  const project = request.body; // store request body of an object

  for (let requiredParameter of ['name']) { // loop over required parameters
    if (!project[requiredParameter]) { // if there is a required parameter missing
      return response.status(422).send( // send 422 error indicating syntax of request was correct but unable to process
        { error: 
          `Expected format: { name: <String> }.` + 
          `You are missing a "${requiredParameter}" property.` });
    } // provide detailed error messaging
  }

  database('projects').insert(project, 'id') // add project to database and return id due to second parameter passed to insert
    .then(project=>{
      response.status(201).json({ id: project[0] }); // 201 indictated request has been fufilled and data has been created
    }) // addtional verification including created project id, knex serves everything in an array
    .catch(error => {
      response.status(500).json({ error }); // provide generic server error
    });
});

app.post('/api/v1/palettes', (request, response) => { // defines endpoint for adding palettes to palettes table
  const palette = request.body; // set body of request to palette variable
  for (let requiredParameter of ['name', 'color1', 'color2', 'color3', 'color4', 'color5', 'projectId']){ // loop over required parameteeers
    if(!palette[requiredParameter]){ // if there is a required parameter missing
      return response.status(422).send({  // send 422 error indictating syntax of request was correct but unable to process
        error: `Expected format: { name: <String>, color1: <String>, color2: <String>, color3: <String>, color4: <String>, color5: <String>, projectId: <Integer> }. You're missing a "${requiredParameter}" property.`  // send 422 error indictating syntax of request was correct but unable to process
      })
    }
  }

  database('palettes').insert(palette, 'id') // add project to database and return id due to second parameter passed to insert
    .then(palette=>{
      response.status(201).json({ id: palette[0] }); // 201 indictated requets has been fiflled and data has been created 
    })
    .catch(error => {
      response.status(500).json({ error }); // provide generic server error
    });
})

app.get('/api/v1/projects', (request, response) => { // defines endpoint as a valid get endpoint
  database('projects').select() // goes to database and gets projects table 
    .then(projects=>{
      return response.status(200).json(projects); // send success status and responds with .json to add headers to response
    }) // 200 is OK status code for get requests 
    .catch(error =>{
      response.status(500).json({ error }); // if error, let client know that there was an error. 500 error is a generic error code for issue with server
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => { // define endpoint for palettes of a specific project
  const { id } = request.params; // get id from requested endpoint request

  database('palettes').where({ projectId: id }).select() // select palette from palettes database when palette id matches id defined above
    .then(palettes=>{
      return response.status(200).json(palettes); // send success status and response with .json to add headers to response
    }) 
    .catch(error =>{
      response.status(500).json({ error }); // if error, provide 500 error for generic server error
    });
});

app.delete('/api/v1/palettes/:id', (request, response)=>{ // define endpoint for palette to delete based on id
  const { id } = request.params;  // destructure id from request object

  database('palettes').where({ id }).del() // destroys palette where id in palettes table matches request id
  .then(palette=>{
    if(palette){ // verify that a palette exists
      response.sendStatus(204); // request fufilled and no additional content to send to client 
    } else {
      response.status(422).json({ error: `No resource with an id of ${id} was found.` }); // error to indicate syntax of request was correct but unable to process
    }
  })
    .catch(error=>{response.status(500).json({ error }) // provide generic server error
  });
})

module.exports = app; // tests wont run without this so export the server for testing!
