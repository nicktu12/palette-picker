# Palette Picker

Palette Picker is a single page application that allows a user to save randomly generated color palettes to a backend built with Node.js and Express. The front end application was built using jQuery. Users are able to create new projects and palettes, as well as delete palettes from the database. 

![palette picker](https://user-images.githubusercontent.com/26471447/33584995-4798003e-d91f-11e7-8440-c4e52127af00.gif)

[Palette Picker on Heroku](https://nt-palettepicker-171201.herokuapp.com/)

## Getting Started

Palette Picker was created using jQuery, Node.js and Express. To install Palette Picker locally, clone down this repository and use node or nodemon to start the server.js file, which serves a static HTML page containing the application.

```
node server.js
```

### Prerequisites

[Find out more about installing node.js](https://nodejs.org/en/download/package-manager/)

The following development dependencies are needed in your package.json in order to run the test suite. 

```
  "devDependencies": {
    "chai": "^4.1.2",
    "chai-http": "git+https://github.com/chaijs/chai-http.git#3ea4524",
    "mocha": "^4.0.1"
  }
```

### Installing

Install node (see link above)

Start the server using the following bash command. 

```
node server.js
```



## Running the tests

The following script can be used to run the test suite

```
npm run test
```

The test suite ensures that the app serves a static html page and handles error for incorrect url routing. All endpoints defined on the server are tested before continuously integrating with CircleCI. 


## Built With

* [jQuery](https://jquery.com/) - UI
* [Node.js](https://nodejs.org/en/) - Database management
* [Postgres](https://www.postgresql.org/) - Database
* [Express](https://expressjs.com/) - Library for Node.js


## Authors

* **Nick Teets** [Github](https://github.com/nicktu12/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Microinteraction Design](https://codepen.io/TrevorWelch/pen/NwERXE)
* [Coolors.co](https://coolors.co/)
