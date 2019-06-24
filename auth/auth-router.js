const router = require('express').Router();
const bcrypt = require('bcryptjs');  // MUST ADD THIS !!!
const Auth = require('./auth-model');

// import middlware
const restrictedMW = require('../myMiddleware/myMiddleware');


// >>>>>>>>>>    LOGIN   >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Creates the Account Login - we MUST hash the password, adds to user table
//  username: groot      // add numbers to this to keep testing simple
//  password: iamgroot   // add numbers to this to keep testing simple
router.post('/register', (req,res) => {
    let user = req.body;

    // Make sure no blank info provided
    if( !user.username || !user.password) {
        return res.status(500).json({
           message: "Provide a username and password"
        })
      }
   
     // We can add other kinds of password checks up here before proceeding such as
     if(user.password.length < 8) {
       return res.status(400).json({
         message: `Password must be at least 8 chars`
       });
     }

    // Main Code needed 
    const hash =bcrypt.hashSync(user.password, 14); // 2^14
    user.password = hash;

     // EXTRA STUFF added to db
     user.numRounds = bcrypt.getRounds(hash);
     user.salt = bcrypt.getSalt(hash);

     // Main Code needed
    Auth.add(user)
        .then(saved => {
            res.status(201).json(saved);
        })
        .catch(err => {
            res.status(500).json(err);
        })

})

// >>>>>>>>>>>>>>>>>>>>>>>   LOGIN    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//  session info is set up in server.js, we ADD session info to LOGIN
router.post('/login', myLogger,(req, res) => {
    let { username, password } = req.body;
  
    Auth.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {

            // ASSIGN user info to session
            req.session.user = user;
            res.status(200).json({
                messge: `Logged in, Welcome user with name ${username} !!! `,
            });
        } else {
          res.status(401).json({ 
              message: `You shall not pass (hacker) >;) ` 
            });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

// >>>>>>>>>>>>>>>>>>>>>>>   LOGOUT & remove session    >>>>>>>>>>>>>>>>>>>>>
//  session info is set up in server.js, we ADD session info to LOGIN

router.get('/logout', restrictedMW, (req, res) => {

    console.log('session B4 dstroy is  ', req.session)
  
    req.session.destroy( err => {
      if(err) {
        console.log(err);
        return res.status(500).json({
          message: `There was an LOGOUT error`,
          error: err,
        })
      } else {
  
        console.log('session is now ', req.session)
      //  res.end();
        res.status(200).json({
          message: "Session nuked"
        })
      }
  
    })

  });

// Custom middleware
function myLogger(req, res, next){
    
    console.log('>>> myLogger called');

    console.log(
        ` >>> a ${req.method} method Requesteeee was made 
          >>> from url  ${req.url} 
          >>> at ${new Date().toISOString()}  from myLogger`);

    next();
};



module.exports = router;