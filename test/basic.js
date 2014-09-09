var checky = require('../index.js');
var assert = require('assert');

var validBook = checky({
   title: String,
   author: {
      type: String,
      optional: true
   },
   ISBN: /^[a-zA-Z0-9]+$/
});

var checkPerson = checky({
   name: String,
   age: {
      type: Number,
      min: 18,
      max: 50
   },
   addr: {
      type: Object,
      fields: {
         street: String,
         number: Object
      }
   },
   hobbies: ['Running', 'Gaming', 'Hacking']
});

assert.equal(checkPerson({
   name: 'Dennis',
   age: 50,
   addr: {
      street: 'Some St',
      number: 42
   },
   hobbies: 'Hacking'
}), true);

assert.equal(checkPerson({
   name: 'Dennis',
   age: 3,
   addr: {
      street: 'Some St',
      number: 42
   },
   hobbies: 'Running'
}), false);

assert.equal(checkPerson({
   name: 'Dennis',
   age: 25,
   addr: {
      street: 'Some St',
      number: 42
   },
   hobbies: 'None'
}), false);

assert.equal(validBook({
   title: 'The C Programming Language',
   ISBN: 'abc123'
}), true);

assert.equal(validBook({
   title: 'The C Programming Language',
   author: 'Kernighan and Ritchie',
   ISBN: 'abc123'
}), true);

assert.equal(validBook({
   title: 'The C Programming Language',
   author: 'Kernighan and Ritchie',
   ISBN: 'abc-123'
}), false);

assert.equal(validBook({
   author: 'Kernighan and Ritchie',
   ISBN: 'abc123'
}), false);

assert.equal(validBook({
   title: 'The C Programming Language',
   author: 42,
   ISBN: 'abc123'
}), false);

console.log('All tests passed. You are awesome!');
