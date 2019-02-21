const chai = require('chai');
const kafra = require('./../src/kafra.cmd');
const commands = require('./../src/commands.json');

const expect = chai.expect;

describe('Kafra Command', function() {
    commands.forEach(c => {
        it('should return ' + c.type + ' when type ' + c.name, function() {
            kafra.run(c.name, message => {

                if(c.type == 'image') {
                    expect(message.type).to.be.equal(c.type);
                    expect(message.originalContentUrl).to.be.equal(c.value);
                } else if(c.type == 'file') {
                    expect(message.type).to.be.equal('text');
                } else {
                    expect(message.type).to.be.equal('text');
                    expect(message.text).to.be.equal(c.value);
                }
                
            })
        });
    });

    it('should return help text when type help', function() {
        kafra.run('help', message => {
            expect(message.type).to.be.equal('text');
            expect(message.text).to.include('taming');
        });
    })
});