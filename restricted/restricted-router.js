const router = require('express').Router();
const Restricted = require('./restricted-model');

// each middleware file has one mudule we access from const variable .. see colors
const sessionCheck = require('../myMiddleware/myMiddleware');
const routeCheck = require('../myMiddleware/restrictedMiddleware');

// myMiddleware2 has two functions, we access via chaining >> see foods
const myMiddleware2 = require('../myMiddleware/myMiddleware2');

// GET ALL color items in restricto table ONLY if logged in, route verified
router.get('/colors',  sessionCheck,  routeCheck, async (req, res) => {
   
    console.log('$$$$$ inside colors, req is ', req.baseUrl);
    
    try {
        const colors = await Restricted.getColors();
        res.status(200).json(colors);
     } 
     catch(err) {
         res.status(500).json({
            message: `Can't get any restricted colors`,
            error: err,
         })
     }
});

// GET all food items in restricto table   LOGIN verified BUT not protected route
//    router.get('/foods', sessionCheck, async (req, res) => {
router.get('/foods', myMiddleware2.myLogger2, myMiddleware2.checkSession2, async (req, res) => {
    await Restricted.getFoods()
        .then(foods => {
            res.status(451).json(foods);
        })
        .catch(err => res.send(err));
})

// GET all word items from restricto table - LOGIN not needed, protected route NOT checked
router.get('/words', (req, res) => {
    Restricted.getWords()
        .then(words => {
            res.status(452).json(words);
        })
        .catch(err => res.send(err));
})


// ADD to restricto table
router.post('/', async(req, res) => {
    const{ fav_color, fav_word, fav_food} = req.body; 
    
    if( fav_color === '' || fav_word === '' || fav_food === '') {
        res.status(400).json({
            message: `you need to enter a color, word, and food`
        })
    } else {
        const color = await Restricted.add(req.body);
        res.status(200).json(color);
    }

})


module.exports = router;