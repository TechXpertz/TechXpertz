const chai = require('chai');
const chaiHttp = requrie('chai-http');
const should = chai.should();
const axios = require('axios');
const { auth_client, auth_config } = require('../config');

chai.use(chaiHttp);

const server = 'http://localhost:5000/auth';
const { client_id, client_secret } = auth_client;

describe('Authentication', () => {

  before(done => {

    // get the management API token
    const tokenReq = {
      'client_id': client_id,
      'client_secret': client_secret,
      'audience': `https://${auth_config.domain}/api/v2`,
      'grant_type': 'client_credentials'
    };
    const tokenRes = await axios.post(`https://${auth_config.domain}/oauth/token`, tokenReq)
      .catch(err => console.log(err));
    const { access_token } = tokenRes;

    // Create a user
    const createRequest = {
      'connection': 'Username-Password-Authentication',
      'email': 'testuser@gmail.com',
      'password': 'Password1'
    }
    const createHeader = {
      'headers': {
        'Authorization': `Bearer ${access_token}`
      }
    };
    const userRes = await axios.post(`https://${auth_config.domain}/api/v2/users`, createRequest, createHeader)
      .catch(err => console.log(err));
    const expectedAuth0Id = userRes.user_id;

  });

  // test: successful signup
  describe('/POST register', () => {
    it('it should save the user into database', done => {
      chai.request(server)
        .post('/register')

    })
  });

});