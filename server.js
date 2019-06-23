// define dependencies 
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

// declare express app
const server = express();


// define routers
const authRouter = require('./auth/auth-router.js'); 
const restrictRouter = require('./restricted/restricted-router');
const usersRouter = require('./users/users-router');

// mount middleware
server.use(express.json());
server.use(helmet());
server.use(cors());

// define endpoints
// define actual endpoints for router objects
server.use('/auth', authRouter);
server.use('/api/users', usersRouter); 
server.use('/api/restricted', restrictRouter);


// sanity check
server.get('/', (req, res) => {
    res.cookie('sanityCookieHere', 'cookieForSanity');

    // res.status(200).json({message: ` sanity message`});

    // OR

     res.send(`<h2> Sanity HTML code here </h2>`);

})

// export !!!
// server object assigned to module.exports
module.exports = server;
