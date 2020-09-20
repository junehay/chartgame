const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/config.js');
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
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));
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

// react build
app.get('*', (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, "../client/build", "index.html"));
    } else {
        next();
    }
});

// error handler
app.use((req, res, next) => {
    res.status(404).send('404errrrrrr');
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('500errrrrrrr');
});

// server
const options = {
    host: process.env.NODE_HOST || 'localhost',
    port: process.env.NODE_PORT || 3001,
}

app.listen(options, () => console.log(`server on!!! ${options.host}:${options.port}`));