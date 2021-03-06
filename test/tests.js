let mongoose = require("mongoose");
let User = require('../app/models/user');
let Event = require('../app/models/event');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

var address = 'http://localhost:8080';

var token = 'l';

var global = {};
chai.use(chaiHttp);

describe('User', () => {
    before((done) => { //Before each test we empty the database
        User.remove({username: 'bigboyben'}, (err) => { 
           done();         
        });     
    });

    after(function() {
        User.remove({}, (err) => { 
            done();         
         });
        Event.remove({}, (err) =>{
            done();
        });
    });

    // Register an admin user with active field set to false
    describe('POST /users', () => {
      var token = 'l';
      it('should register a user', (done) => {
        let user = {
            name: "Ben Ben",
            username: "bigboyben",
            email: 'dhobbs06@clongowes.net',
            password: "Password*1",
            permission: "admin",
        }
        chai.request(address)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('Account Registered! Please check email for activation link');
                token = res.body.token;
              done();
            });
      });
      });

    // Try to login without the active field
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
      it('should login for an activated account', (done) => {
        let login = {
            username: "dhobbs",
            password: "Password*1"
        }
        chai.request(address)
            .post('/api/authenticate')
            .send(login)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('User logged in successfully');
              done();
            });
      });
      it('should not login with an incorrect password', (done) => {
        let login = {
            username: "dhobbs",
            password: "wrong"
        }
        chai.request(address)
            .post('/api/authenticate')
            .send(login)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(false);
                res.body.message.should.be.eql('Incorrect password');
              done();
            });
      });
      it('should login', (done) => {
        let login = {
            username: "dhobbs",
            password: "Password*1"
        }
        chai.request(address)
            .post('/api/authenticate')
            .send(login)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('User logged in successfully');
                global.token = res.body.token;
              done();
            });
      });
      });

    // Resending email .. Checking passwords work without activation
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
      
      
    describe('POST /changePassword', () => {
        it('should change password correctly', (done) => {
          let user = {
              username: "dhobbs",
              oldPassword: "Password*1",
              newPassword: "Password*2"
          }
          chai.request(address)
              .post('/api/changePassword')
              .send(user)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.success.should.be.eql(true);
                  res.body.message.should.be.eql('Password has been changed');
                done();
              });
        });
        it('should login with new password', (done) => {
            let login = {
                username: "dhobbs",
                password: "Password*2"
            }
            chai.request(address)
                .post('/api/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.eql(true);
                    res.body.message.should.be.eql('User logged in successfully');
                  done();
                });
          });
          it('should not login with an the old password', (done) => {
            let login = {
                username: "dhobbs",
                password: "Password*1"
            }
            chai.request(address)
                .post('/api/authenticate')
                .send(login)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.eql(false);
                    res.body.message.should.be.eql('Incorrect password');
                  done();
                });
          });
    });

    describe('POST /changeUsername', () => {
      it('it should correctly change the username', (done) => {
        let user = {
            username: "dhobbs",
            newUsername: "dhobbs06",
            password: "Password*2"
        }
        chai.request(address)
            .post('/api/changeUsername')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('Username has been changed');
                res.body.name.should.be.eql('dhobbs06');
              done();
            });
      });
    });

    // Creat an awesome event
     describe('POST /users', () => {
        it('should create an event', (done) => {
          let event = {
            "description" : "This is a description",
            "name" : "Test Event",
            "id" : "testEvent",
            "venue" : "test venue",
            "date" : "2018-03-06T00:00:00.000Z",
            "tables" : 10,
            "seats" : 10,
            "token" : global.token
          }
          chai.request(address)
              .post('/api/createEvent')
              .send(event)
              .end((err, res) => {
                  res.should.have.status(200);
                  res.body.success.should.be.eql(true);
                  res.body.message.should.be.eql('Event Created');
                  token = res.body.token;
                done();
              });
        });
        });

    describe('PUT /viewEvent/:id/:email/:check', () => {

      it('should add user to list', (done) => {

        let id = "testEvent";
        let email = "dhobbs@tcd.ie";
        let check = 1;

        let list = {
          token: global.token
        }
        chai.request(address)
            .put('/api/viewEvent/' + id + '/' + email + '/' + check)
            .send(list)
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('User added to invite list');
              done();
            });
      });

      it('should fail if user already in list', (done) => {

        let id = "testEvent";
        let email = "dhobbs@tcd.ie";
        let check = 1;

        let list = {
          token: global.token
        }
        chai.request(address)
            .put('/api/viewEvent/' + id + '/' + email + '/' + check)
            .send(list)
            .end((err, res) => {

                res.should.have.status(200);
                res.body.success.should.be.eql(false);
                res.body.message.should.be.eql('user already added');
              done();
            });
      });

      });

    describe('Delete /viewEvent/:id/:email', () => {

      it('should remove user from list', (done) => {

        let id = "testEvent";
        let email = "dhobbs@tcd.ie";

        let list = {
          token: global.token
        }
        chai.request(address)
            .delete('/api/viewEvent/' + id + '/' + email)
            .send(list)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('user removed');
              done();
            });
      });
      });

    describe('POST /users', () => {
        var token = 'l';
        it('should register a guest for an event', (done) => {
          let user = {
              name: "Rob Cooney",
              username: "rtc12345",
              email: 'cooneyro@tcd.ie',
              password: "Password*1",
              permission: "admin",
              active: "true"
          }
          chai.request(address)
              .post('/api/users')
              .send(user);

          let login = {
                username: "rtc12345",
                password: "Password*1"
            }
          chai.request(address)
            .post('/api/authenticate')
            .send(login);

            let guest = {
                name: "Bob Cooney",
                username: "rtc123456",
                email: 'xddddddd@gmail.com',
                password: "Password*1",
                number: "1111111",
                event: "Dinner",
                vegetarian: true,
                vegan: false,
                coeliac: false
            }
            //TODO: Test event info submission
            chai.request(address)
            .post('/api/users')
            .send(guest)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.be.eql(true);
                res.body.message.should.be.eql('Account Registered! Please check email for activation link');
                token = res.body.token;
              done();
            });
        });
        });
});


