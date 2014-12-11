'use strict';

module.exports = function(schema) {
   return function(obj, opt) {
      schema = schema || {};
      opt = opt || {};
      opt.depth = 1;
      return checky(obj, schema, opt);
   }
}

function violation(error, opt) {
   // bubble errors
   if (--opt.depth || opt.err) {
      return error;
   } else {
      if (opt.debug) {
         console.log('[' + error.field + '] ' + error.msg);
      }

      return false;
   }
}

function checky(obj, schema, opt) {
   opt = opt || {};
   if (!obj || obj.constructor !== Object) {
      return false;
   }

   var constraints = {};

   constraints[Function] = basicConstraint;
   constraints[undefined] = basicConstraint;
   constraints[null] = basicConstraint;
   constraints[Array] = setConstraint;
   constraints[RegExp] = patternConstraint;
   constraints[Object] = complexConstraint;

   // assert obj fields exist in schema
   for (var f in obj) {
      if (!opt.sparse && !schema.hasOwnProperty(f)) {
         error = {
            violation: 'unexpected',
            field: f,
            msg: 'Found unexpected field: ' + f
         };
         return violation(error, opt);
      }
   }

   for (var f in schema) {
      var error = null;
      var type; 

      try {
         type = schema[f].constructor;
      } catch (e) {
         type = schema[f];
      }
 
      if (!obj.hasOwnProperty(f)) {
         if (!opt.sparse && !schema[f].optional) {
            error = {
               violation: 'missing',
               field: f,
               msg: 'Missing field: ' + f
            };
         }
      } else {
         error = constraints[type]({
            obj: obj,
            schema: schema,
            opt: opt
         }, f);
      }

      if (error) {
         return violation(error, opt);
      }
   }

   return (--opt.depth) ? null : true;
}

function basicConstraint(comp, field) {
   var error = null;
   var type;
   var obj = comp.obj;
   var schema = comp.schema;

   try {
      type = obj[field].constructor;
   } catch (e) {
      type = obj[field];
   }

   if (schema[field] !== type) {
      error = {
         violation: 'type',
         field: field,
         msg: 'Invalid type: ' + type + '. Expecting: ' + schema[field]
      };
   }

   return error;
}

function setConstraint(comp, field) {
   var error = null;
   var obj = comp.obj;
   var schema = comp.schema;

   if (schema[field].indexOf(obj[field]) <= -1) {
      error = {
         violation: 'set',
         field: field,
         msg: 'Value "' + obj[field] + '" not matched by: ' + schema[field]
      };
   }

   return error;
}

function patternConstraint(comp, field) {
   var error = null;
   var obj = comp.obj;
   var schema = comp.schema;

   if (!obj[field].match(schema[field])) {
      error = {
         violation: 'pattern',
         field: field,
         msg: 'Value "' + obj[field] + '" not found in: ' + schema[field]
      };
   }

   return error;
}

function complexConstraint(comp, field) {
   var error = null;
   var type;
   var obj = comp.obj;
   var schema = comp.schema;
   var opt = comp.opt;

   try {
      type = obj[field].constructor;
   } catch (e) {
      type = obj[field];
   }

   if (schema[field].type !== type) {
      error = {
         violation: 'type',
         field: field,
         msg: 'Invalid type: ' + type + '. Expecting: ' + schema[field].type
      };
   } else {
      if (schema[field].comparator && schema[field].comparator.constructor === Function) {
         if (!schema[field].comparator(obj[field])) {
            error = {
               violation: 'comparator',
               field: field,
               msg: 'Comparator returned false for: ' + field
            };
         }
      } else if (type === Number) {
         if (schema[field].min !== undefined && obj[field] < schema[field].min) {
            error = {
               violation: 'min',
               field: field,
               msg: 'Number less than minimum: ' + schema[field].min
            }
         }

         if (schema[field].max !== undefined && obj[field] > schema[field].max) {
            error = {
               violation: 'max',
               field: field,
               msg: 'Number greater than maximum: ' + schema[field].max
            };
         }
      } else if (type === String) {
         var len = obj[field].length;
         var pattern = schema[field].pattern;

         if (schema[field].min !== undefined && len < schema[field].min) {
            error = {
               violation: 'min',
               field: field,
               msg: 'String length less than minimum: ' + schema[field].min
            }
         }

         if (schema[field].max !== undefined && len > schema[field].max) {
            error = {
               violation: 'max',
               field: field,
               msg: 'String length greater than maximum: ' + schema[field].max
            };
         }

         if (pattern !== undefined && !obj[field].match(pattern)) {
            error = {
               violation: 'pattern',
               field: field,
               msg: 'Value "' + obj[field] + '" not found in: ' + schema[field]
            };
         }
      } else if (type === Object) {
         ++opt.depth;
         error = checky(obj[field], schema[field].fields, opt);
      }
   }

   return error;
}
