module.exports = function(schema) {
   return function(obj, debug) {
      return checky({
         obj: obj,
         schema: schema || {},
         debug: debug || false
      });
   }
}

function basicConstraint(obj, schema, field) {
   var error = null;

   if (schema[field] !== obj[field].constructor) {
      error = {
         msg: 'Invalid type: ' + obj[field].constructor + '. Expecting: ' + Function
      };
   }

   return error;
}

function setConstraint(obj, schema, field) {
   var error = null;

   if (schema[field].indexOf(obj[field]) <= -1) {
      error = {
         msg: 'Value "' + obj[field] + '" not matched by: ' + schema[field]
      };
   }

   return error;
}

function patternConstraint(obj, schema, field) {
   var error = null;

   if (!obj[field].match(schema[field])) {
      error = {
         msg: 'Value "' + obj[field] + '" not found in: ' + schema[field]
      };
   }

   return error;
}

function complexConstraint(obj, schema, field) {
   var fieldType = obj[field].constructor;
   var error = null;

   if (schema[field].type !== fieldType) {
      error = {
         msg: 'Invalid type: ' + fieldType + '. Expecting: ' + schema[field].type
      };
   } else {
      if (schema[field].comparator && schema[field].comparator.constructor === Function) {
         if (!schema[field].comparator(obj[field])) {
            error = {
               msg: 'Comparator returned false for: ' + field
            };
         }
      } else if (fieldType === Number) {
         if (schema[field].min !== undefined && obj[field] < schema[field].min) {
            error = {
            };
         }

         if (schema[field].max !== undefined && obj[field] > schema[field].max) {
            error = {};
         }
      } else if (fieldType === String) {
         var len = obj[field].length;

         if (schema[field].min !== undefined && len < schema[field].min) {
            error = {};
         }

         if (schema[field].max !== undefined && len > schema[field].max) {
            error = {};
         }

         if (schema[field].pattern !== undefined && !obj[field].match(pattern)) {
            error = {};
         }
      } else if (fieldType === Object) {
         error = checky({
            obj: obj[field],
            schema: schema[field].fields,
            rec: true
         });
      }
   }

   return error;
}

function checky(opt) {
   opt = opt || {};
   if (!opt.obj || opt.obj.constructor !== Object) return false;

   var constraints = {};
   var schemaFields = Object.keys(opt.schema);

   constraints[Function] = basicConstraint;
   constraints[Array] = setConstraint;
   constraints[RegExp] = patternConstraint;
   constraints[Object] = complexConstraint;

   for (var i = 0; i < schemaFields.length; ++i) {
      var field = schemaFields[i];
      var type = opt.schema[field].constructor;
      var error = null;

      if (!opt.obj.hasOwnProperty(field)) {
         if (!opt.schema[field].optional) {
            error = {
               msg: 'Missing field: ' + field
            };
         }
      } else {
         error = constraints[type](opt.obj, opt.schema, field);
      }

      if (error) {
         // bubble errors
         if (opt.rec) {
            return error;
         } else {
            if (opt.debug) {
               console.log(error.msg);
            }

            return false;
         }
      }
   }

   if (opt.rec) {
      return null;
   } else {
      return true;
   }
}
