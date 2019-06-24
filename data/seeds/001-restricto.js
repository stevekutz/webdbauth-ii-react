// 001-restricto

// THERE are default values in table definition
// they will be automatically filled even though
// not specified in seed file !


exports.seed = async knex => {
  // Deletes ALL existing entries

      await knex('restricto').insert([
        {id: 1, fav_color: 'green', fav_word: 'now', fav_food: 'apples'},
        {id: 2, fav_color: 'blue', fav_word: 'like', fav_food: 'bananas'},
        {id: 3, fav_color: 'red', fav_word: 'love', fav_food: 'blueberries'},
      ]);
};
