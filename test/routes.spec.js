const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

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
    .catch(error=>{throw error})
  })

  it('should return a 404 for a route that does not exist', ()=>{
    return chai.request(server)
    .get('/sad')
    .then(response=>{
      response.should.have.status(404);
    })
    .catch(error=>{throw error})
  })
})

describe('API routes', ()=>{
  describe('GET /api/v1/projects',()=>{
    it('should return all projects', ()=>{
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response=>{
        response.should.have.status(200);    
        response.should.be.json;
        response.body.should.be.a('array');
        console.log(response.body)
      })
    })
  }) 
})
