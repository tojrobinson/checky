var checky = require('../index.js');
var assert = require('assert');

var Book = checky({
   title: String,
   author: {
      type: String,
      optional: true
   }
});

assert.equal(Book({
   title: 'The C Programming Language'
}), true);

assert.equal(Book({
   title: 'The C Programming Language',
   author: 'Kernighan and Ritchie'
}), true);

assert.equal(Book({
   author: 'Kernighan and Ritchie'
}), false);

assert.equal(Book({
   title: 'The C Programming Language',
   author: 42
}), false);

console.log('All tests passed. You are awesome!');
