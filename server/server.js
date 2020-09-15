const express = require('express');
const app = express();
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/config.json');
const api = require('./routes/api.js');
const admin = require('./routes/admin.js');

// middleware
app.use(session({
    secret: config.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60
    },
}));
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
app.use(logger('dev'));
app.use(cookieParser(config.SECRET_KEY));

// session setting
app.use((req, res, next) => {
    if(!req.session.uuid){
        req.session.uuid = uuidv4();
    }
    next();
});

// router
app.use('/api', api);
app.use('/api/admin', admin);


// error handler
app.use((req, res, next) => {
    res.status(404).send('404errrrrrr');
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('500errrrrrrr');
});

// server
const port = 3001;
app.listen(port, () => console.log(`port is ${port}`));