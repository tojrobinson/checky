checky
======
Declarative JavaScript object validation.

Usage
-----

```javascript
var checky = require('checky');

var checkPerson = checky({
   name: String,
   age: {
      type: Number,
      min: 18,
      max: 80
   },
   hobby: ['Running', 'Gaming', 'Hacking'],
   other: {
      type: String,
      optional: true
   }
});

var dennis = {
   name: 'Dennis Ritchie',
   age: 70,
   hobby: 'Hacking'
};

checkPerson(dennis); // true
```

Recursive Schemas
-----------------
```javascript
var checkNested = checky({
   name: String,
   age: Number,
   nested: {
      type: Object,
      fields: {
         name: String,
         age: Number,
         nested: {
            type: Object,
            fields: {
               name: String,
               age: Number
            }
         }
      }
   }
});

var russianStallmans = {
   name: 'Richard Stallman',
   age: 61,
   nested: {
      name: 'Richard Stallman',
      age: 61,
      nested: {
         name: 'Richard Stallman',
         age: 61
      }
   }
};

checkNested(russianStallmans); // true
```

Options
-------
The second argument to the schema checking function returned by **checky** is an options object. Options include:
* debug  (true|false) - print error messages for invalid objects
* sparse (true|false) - all schema fields are made optional
