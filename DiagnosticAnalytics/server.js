const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
var session = require('express-session');
const crypto = require('crypto');
const app = express()
const port = 5000;
const arc = require('./API/main');
const ar = require('./API/api');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: crypto.randomBytes(16).toString('hex'),
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false
}));




app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/', upload.single("file"), (req, res, next) => {
    arc.display(req, res, next);
})
app.post('/ab', upload.single("file"), (req, res) => {
    ar.gd(req, res);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})