const chai = require('chai');
const chaiHttp = requrie('chai-http');
const should = chai.should();
const axios = require('axios');
const { auth_client, auth_config } = require('../config');

chai.use(chaiHttp);

const server = 'http://localhost:5000';
const { client_id, client_secret } = auth_client;

describe('Authentication', () => {
  before(done => {

    // get the management API token
    const req = {
      'client_id': client_id,
      'client_secret': client_secret,
      'audience': `https://${auth_config.domain}/api/v2`,
      'grant_type': 'client_credentials'
    };
    const res = await axios.post(`https://${auth_config.domain}/oauth/token`, req)
      .catch(err => console.log(err));
    console.log(res.access_token);

  });


})