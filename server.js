// define dependencies 
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

/////////////
// to create a server session for currently logged on user
// we need to add this
const session = require('express-session');   // ADDED here

// WE DEFINE middleware2 in server
const myLogger2 = require('./myMiddleware/myMiddleware2');
////////////

// declare express app
const server = express();

/////////////
// THIS is needed to define session in our db instead of server memory
// this returns a class, so we use Uppercase 
const SessionStore = require('connect-session-knex')(session);

const sessionConfig = {
    name: 'monkeyChallenge', // session name,
    secret: 'super secret string' , // used to sign/encrypt the session ID cookie
    resave: false,  // it avoids re-creating an unchanged session
    saveUninitialized: false,   // prevents setting cookies automatically
    cookie: {
      maxAge: 60*60*1000   , // when cookie expires(in ms), 1 hour = 60*60*1000
      secure: false,   // true for HTTPS, false for HTTP, need SSL cert for HTTPS
      httpOnly: true, // Set-Cookie attribute, we DO NOT want session coookie avail to JavaScript
    },    // WE add below AFTER installing connect-session-knex to create db Storage
    store: new SessionStore({
    knex: require('./data/dbConfig'),  // provides knex instance
      tablename: 'sessions',   // table name in db
     sidfieldname: 'sid',    // column name in sessions table
     createtable: true,    // create this table if it exists
     clearInterval:  60*60*1000 // time in ms the session will expire 60sec * 60min * 1000ms
    })     
  }
//////////////




// define routers
const authRouter = require('./auth/auth-router.js'); 
const restrictRouter = require('./restricted/restricted-router');
const usersRouter = require('./users/users-router');

// mount middleware
server.use(express.json());
server.use(helmet());
server.use(cors());

///////////////
server.use(session(sessionConfig)); // NOTICE sessionConfig here !
//////////////

// define endpoints
// define actual endpoints for router objects
server.use('/auth', authRouter);
server.use('/api/users', usersRouter); 
server.use('/api/restricted', restrictRouter);


///////////////
server.use(myLoggerServer);
// custom middleware callbacks definitions
// myLogger
function myLoggerServer(req, res, next){
    
    console.log('>>> myLoggerServer called');

    console.log(
        ` >>> a ${req.method} method Requesteeee was made 
          >>> from url  ${req.url} 
          >>> at ${new Date().toISOString()}  from myLogger`);

    next();
};
//////////////


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
