let mongoose = require("mongoose");
let User = require('../app/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

var address = 'http://localhost:8080';

chai.use(chaiHttp);

describe('User', () => {
    before((done) => { //Before each test we empty the database
        User.remove({}, (err) => { 
           done();         
        });     
    });

    describe('POST /users', () => {
      it('it should register a user', (done) => {
        let user = {
            name: "Ben Ben",
            username: "bigboyben",
            email: 'dhobbs@tcd.ie',
            password: "Password*1"
        }
        chai.request(address)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('Account Registered! Please check email for activation link');
              done();
            });
      });
  	});

      describe('POST /authenticate', () => {
      it('it should not log in due to activation link not being pressed', (done) => {
        let user = {
            username: "bigboyben",
            password: "Password*1"
        }
        chai.request(address)
            .post('/api/authenticate')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(false);
                res.body.linkFail.should.be.eql(true);
                res.body.message.should.be.eql('Account is not yet activated. Check your email');
              done();
            });
      });
  	});

      describe('POST /resend', () => {
      it('it should correctly verify credentials', (done) => {
        let user = {
            username: "bigboyben",
            password: "Password*1"
        }
        chai.request(address)
            .post('/api/resend')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
              done();
            });
      });
  	});
});


