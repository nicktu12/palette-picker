const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client routes', ()=>{
  it('should return the homepage with html', ()=>{
    return chai.request(server)
      .get('/')
      .then(response=>{
        response.should.have.status(200);
        response.should.be.html;
        response.res.text.should.include('Palette Picker');
      })
      .catch(error=>{
        throw error;
      });
  });

  it('should return a 404 for a route that does not exist', ()=>{
    return chai.request(server)
      .get('/sad')
      .then(response=>{
        response.should.have.status(404);
      })
      .catch(error=>{
        throw error;
      });
  });
});

describe('API routes', ()=>{

  before((done)=>{
    database.migrate.latest()
      .then(() => done())
      .catch(error=>{
        throw error;
      });
  });

  beforeEach((done)=>{
    database.seed.run()
      .then(()=>done())
      .catch(error=>{
        throw error;
      });
  });

  describe('GET /api/v1/projects', ()=>{
    it('should return all projects', ()=>{
      return chai.request(server)
        .get('/api/v1/projects')
        .then(response=>{
          response.should.have.status(200);    
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('My First Project');
          response.body[0].should.have.property('id');
        })
        .catch(error=>{
          throw error;
        });
    });
  });


  describe('GET /api/v1/projects/:id/palettes', ()=>{
    it('should return all palettes from a specific project',()=>{
      return chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response=>{
          response.should.have.status(200);
          response.should.be.json;
          response.body.length.should.equal(2);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('My first palette');
          response.body[0].should.have.property('color1');
          response.body[0].color1.should.equal('#dd0d0d');
          response.body[0].should.have.property('color2');
          response.body[0].color2.should.equal('#ff00f4');
          response.body[0].should.have.property('color3');
          response.body[0].color3.should.equal('#f07272');
          response.body[0].should.have.property('color4');
          response.body[0].color4.should.equal('#a90091');
          response.body[0].should.have.property('color5');
          response.body[0].color5.should.equal('#0078c1');
          response.body[0].should.have.property('projectId');
          response.body[0].projectId.should.equal(1);
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
        })
        .catch(error=>{
          throw error;
        });
    });
  });

  describe('POST /api/v1/projects', ()=>{
    it('should be able to add a project to the database', (done)=>{
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          name: 'A Brand New Project'
        })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.a.property('id');
          chai.request(server)
            .get('/api/v1/projects')
            .end((error, response)=>{
              response.body.should.be.a('array');
              response.body.length.should.equal(2);
              done();
            });
        });
    });

    it('should not create a project if missing name property', (done)=>{
      chai.request(server)
        .post('/api/v1/projects')
        .send({
          id: 2
        })
        .end((error, response)=>{
          response.should.have.status(422);
          done();
        });
    });
  });

});
