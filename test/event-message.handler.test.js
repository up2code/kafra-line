const eventMessage = require('../src/event-message.handler');
const chai = require('chai');
const expect = chai.expect;

describe('event message handler api test', function () {

    it('test get latest price', function (done) {
        const event = { message: { text: '$cyfar' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.any.keys('type','altText','contents');
            done();
        })
    });

    it('test get latest price from romexchange', function (done) {
        const event = { message: { text: '$$cyfar' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.any.keys('type','altText','contents');
            done();
        })
    });

    it('test get trending list', function (done) {
        const event = { message: { text: '$trending' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.any.keys('type','altText','contents');
            done();
        })
    });

    it('test get card list', function (done) {
        const event = { message: { text: '$bluecards' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.all.keys('type','text');
            done();
        })
    });

    it('test run !help command', function (done) {
        const event = { message: { text: '!help' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.all.keys('type','text');
            done();
        })
    });
    
    it('test run !taming command', function (done) {
        const event = { message: { text: '!taming' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.all.keys('type','originalContentUrl', 'previewImageUrl');
            done();
        })
    });

    it('test run ไขกาชา command', function (done) {
        const event = { message: { text: 'ไขกาชา' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.all.keys('type','text');
            done();
        })
    });
    
    it('test run test chat command', function (done) {
        const event = { message: { text: 'test' } }
        eventMessage(event)
        .then(message => {
            expect(message).to.be.an('object').that.has.all.keys('type','text');
            done();
        })
    });
});