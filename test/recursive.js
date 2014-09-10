var checky = require('../index.js');
var assert = require('assert');

var nestedSchema = checky({
   string: String,
   number: Number,
   nested: {
      type: Object,
      fields: {
         string: String,
         number: Number,
         nested: {
            type: Object,
            fields: {
               string: String,
               number: Number,
               nested: {
                  type: Object,
                  fields: {
                     string: String,
                     number: Number
                  }
               }
            }
         }
      }
   }
});

var valid = {
   string: 'string',
   number: 42,
   nested: {
      string: 'string',
      number: 42,
      nested: {
         string: 'string',
         number: 42,
         nested: {
            string: 'string',
            number: 42
         }
      }
   }
};

var invalid = {
   string: 'string',
   number: 42,
   nested: {
      string: 'string',
      number: 42,
      nested: {
         string: 'string',
         number: 42,
         nested: {
            string: 'string',
            number: 'NOT A NUMBER!'
         }
      }
   }
};

assert.equal(nestedSchema(valid), true);
assert.equal(nestedSchema(invalid), false);

console.log('All tests passed. You are awesome!');
