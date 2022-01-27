/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import * as sinon from 'sinon';
import crypto from 'crypto';
import dynamo from 'dynamodb';

import app from '../src/server';
import emailEventData from './mock';
import Models from '../src/models';
import Config from '../src/config';

// Configure chai
chai.use(chaiHttp);
chai.should();
let sinonSandbox;

describe('Test Leads', () => {

    afterEach((done) => {
        sinonSandbox.restore()
        done();
    })

  describe('Test email events', () => {
    it('It should not recieve webhook with invalid MAILGUN_WEBHOOK_SIGNIN_KEY', (done) => {
    sinonSandbox = sinon.createSandbox();
    sinonSandbox.stub(crypto, 'createHmac').returns({
        update: () => {
          const digest = () =>{
            return 'invalidkey';
          };
          return {digest};
        }
    });
    chai.request(app)
      .post('/v1/emails/event')
      .send(emailEventData)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('This event may not come from mailgun');
        done();
      });
    })?.timeout(10000);

    it('It should receive webhook event from mailgun', (done) => {
      sinonSandbox = sinon.createSandbox();
      sinonSandbox.stub(Models, 'EmailEvent').returns({
        save: () => {
          return Promise.resolve({Items: []});
        }
      });
      sinonSandbox.stub(crypto, 'createHmac').returns({
          update: () => {
            const digest = () =>{
              return emailEventData.signature.signature;
            };
            return {digest};
          }
      });
      sinonSandbox.stub(Config.AWS, 'SNS').returns({
        publish: () => {
          return { promise: ()=> Promise.resolve({ message: 'publish succesful' })};
        }
      });
    chai.request(app)
      .post('/v1/emails/event')
      .send(emailEventData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('message').eql('Event received and published');
        done();
      });
    })?.timeout(10000);
  });
});
