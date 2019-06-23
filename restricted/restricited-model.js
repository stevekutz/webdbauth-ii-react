const db = require('../data/dbConfig');

module.exports = {
    getColors,
    getWords,
    getFoods,
    add,

}

function getColors() {
    return db('restricto ')
    .select('fav_color');
}

function getWords() {
    return db('restricto')
    .select('fav_word');
}

function getFoods() {
    return db('restricto')
    .select('fav_food');
}

function add(item) {
    return db('restricto')
        .insert(item)
        .then(ids => ({id: ids[0]}));
}


