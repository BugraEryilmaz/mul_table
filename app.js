const express = require('express')
const app = express()
var path = require('path');
const PORT_NUMBER = process.env.PORT || 3000;

app.get('/', (req, res) => {
    console.log("hello w");
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(PORT_NUMBER, () => {
    console.log(`Example app listening at http://localhost:${PORT_NUMBER}`)
})