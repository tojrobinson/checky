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
   hobby: ['Running', 'Gaming', 'Hacking']
});

var dennis = {
   name: 'Dennis Ritchie',
   age: 70,
   hobby: 'Hacking'
};

checkPerson (dennis); // true
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

Debugging
---------
Passing in `true` as the second argument to the schema checking function (returned by **checky**) will cause error reports for invalid objects to be printed.
