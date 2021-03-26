require('dotenv').config();

const express = require('express')
const app = express()
var path = require('path');
const PORT_NUMBER = process.env.PORT || 3000;

const monk = require('monk');
const db = monk(process.env.MONGODB_URI);
const ips = db.get('scoreboard');

app.use(express.static('public'));
app.use(express.json());

app.listen(PORT_NUMBER, () => {
    console.log(`Example app listening at http://localhost:${PORT_NUMBER}`)
})

app.post('/api/highscoreget', async (req, res) => {
    const options = req.body.options;
    const numbers = req.body.numbers;
    const ret = await ips.find({'options': options, 'numbers':numbers}, { sort: { score: -1 }, limit: 10 });
    res.send(ret);
})

app.post('/api/highscore', async (req, res) => {
    const score = req.body.score;
    const name = req.body.name.replace(/\s/g, "").toLowerCase();
    const options = req.body.options;
    const numbers = req.body.numbers;
    const ret = await ips.find({'options': options, 'numbers':numbers}, { sort: { score: 1 }, limit: 10 });
    var update = false;
    ret.forEach(async (element) => {
        if (element.name == name) {
            if (score > element.score) {
                ips.findOneAndUpdate({'name': name, 'numbers':numbers, 'options': options, 'score': element.score}, { $set: { 'score': score} });
            }
            update = true;
        }
    });
    if (!update) {
        if (ret.length < 10) {
            ips.insert({'name': name, 'numbers':numbers, 'options': options, 'score': score});
        }
        else if (ret[0].score < score) {
            ips.findOneAndUpdate({'name': ret[0].name, 'numbers':numbers, 'options': ret[0].options, 'score': ret[0].score}, { $set: {'name': name, 'options': options, 'score': score} });
        }
    }
    res.send(''+score);
})
