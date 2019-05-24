const firebase = require('./firebase');
const lineMessage = require('./line.message');
const Chance = require('chance')
const chance = new Chance();

const gachaAnswer = answers => {
    
    console.log(JSON.stringify(answers))

    let totalChance = answers.reduce((total, answer) => total + Number(answer.chance), 0);
    let dice = chance.integer({min: 1, max: totalChance})
    let rateTotal = 0;
    for(var i=0;i<answers.length;i++) {
        rateTotal += answers[i].chance;
        answers[i].rate = rateTotal;
    }

    console.log('total chance : ' + totalChance)
    console.log('dice : ' + dice)
    
    return answers.sort(function(a,b){ return a.rate - b.rate})
                    .find(function(s){ return dice<=s.rate });
}

module.exports = text => {
    return firebase.getAllChat()
    .then(answers => {
        let ans = answers.find(ans => RegExp(ans.match,'g').test(text));

        if(!ans) return null;

        console.log(ans)

        if(ans.chance) {
            return (chance.bool({likelihood: ans.chance}))? chance.pickone(ans.answers) : null;
        }

        if(ans.type && ans.type == 'gacha') {
            return gachaAnswer(ans.answers);
        }

        return chance.pickone(ans.answers);
    })
    .then(answer => {
        if(!answer) return null;
        
        switch(answer.type) {
            case 'text':
                return lineMessage.createTextMessage(answer.value);
            case 'image':
                return lineMessage.createImageMessage(answer.value, answer.value);
        }
    });
}