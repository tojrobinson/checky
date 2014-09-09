checky
======
Declarative JavaScript object validation.

Usage
-----

```
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
