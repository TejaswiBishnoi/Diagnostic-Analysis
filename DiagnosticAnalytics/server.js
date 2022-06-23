const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var session = require('express-session');
const crypto = require('crypto');
const app = express()
const port = 3000;
const arc = require('./API/main');


app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: crypto.randomBytes(16).toString('hex'),
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 },
    resave: false
}));

app.all("*", async (req, res, func) => {
    const regex = /[/]api[/]/g;
    console.log(`Incoming request from ${req.ip} to ${req.url}`);
    if( regex.test(req.url) ){
        try {
            const url = req.url;
            var path = "";
            for( var i=0;i < url.length && url[i]!='?' ; i++ ){
                path += url[i];
            }
            console.log(`Loading .${path}`);
            var api = require(`.${path}`);
            try {
                await api.execute(req, res);
            }
            catch(err){
                console.log(`Error: ${err.message}`)
            }
        }
        catch(err){
            console.log(`Failed to load .${req.url} ! \n error: ${err.message}`)
            res.status(200).json({
                success: false,
                message: err.message,
            });
        }
    }
    else{
        res.status(200).json({
            success: false,
            message: "Page not found ! ",
        });
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/', (req, res) => {
    arc.display(req, res);
})
app.use(cors());
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})