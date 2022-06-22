const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var session = require('express-session');
const crypto = require('crypto');
const app = express()
const port = 3000

app.use(session({
    secret: crypto.randomBytes(16).toString('hex'),
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use(cors());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})