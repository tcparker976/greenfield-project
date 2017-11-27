// var request = require('request');
const app = require(__dirname + '/../server/app');
const request = require('supertest');
const expects = require('chai').expect;

// describe('server', function() {
//   it('should respond to GET requests', function(done) {
//     request('http://127.0.0.1:3000/', function(error, response, body) {
//       expect(response.statusCode).to.equal(200);
//       done();
//     });
//   });
// });

describe('GET /', function() {
  it('should respond with 200', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
})