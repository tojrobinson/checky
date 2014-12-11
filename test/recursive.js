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

valid.nested.nested.unexpected = 42;
assert.equal(nestedSchema(valid), false);
assert.equal(nestedSchema(valid, {err: true}).field, 'unexpected');
assert.equal(nestedSchema(valid, {sparse: true}), true);

delete valid.nested.nested.unexpected;
assert.equal(nestedSchema(valid), true);

delete valid.string;
assert.equal(nestedSchema(valid), false);
assert.equal(nestedSchema(valid, {err: true}).field, 'string');
assert.equal(nestedSchema(valid, {sparse: true}), true);

console.log('All tests passed. You are awesome!');
