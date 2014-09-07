var checky = require('../index.js');
var assert = require('assert');

var Book = checky({
   title: String,
   author: {
      type: String,
      optional: true
   },
   ISBN: /^[a-zA-Z0-9]+$/
});

assert.equal(Book({
   title: 'The C Programming Language',
   ISBN: 'abc123'
}), true);

assert.equal(Book({
   title: 'The C Programming Language',
   author: 'Kernighan and Ritchie',
   ISBN: 'abc123'
}), true);

assert.equal(Book({
   title: 'The C Programming Language',
   author: 'Kernighan and Ritchie',
   ISBN: 'abc-123'
}), false);

assert.equal(Book({
   author: 'Kernighan and Ritchie',
   ISBN: 'abc123'
}), false);

assert.equal(Book({
   title: 'The C Programming Language',
   author: 42,
   ISBN: 'abc123'
}), false);

console.log('All tests passed. You are awesome!');
