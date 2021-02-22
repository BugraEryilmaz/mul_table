const express = require('express')
const app = express()
var path = require('path');
const port = 3000

app.get('/', (req, res) => {
    console.log("hello w");
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})