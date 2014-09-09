module.exports = function(schema) {
   schema = schema || {};
   var schemaKeys = Object.keys(schema);

   return function(o) {
      if (!o || o.constructor !== Object) return false;

      for (var i = 0; i < schemaKeys.length; ++i) {
         var key = schemaKeys[i];
         var type = schema[key].constructor;
         var valid = true;

         if (!o.hasOwnProperty(key)) {
            if (!schema[key].optional) {
               valid = false;
            }
         } else {
            var fieldType = o[key].constructor;

            if (type === Function && schema[key] !== fieldType) { // Basic type constraint
               valid = false;
            } else if (type === RegExp && !o[key].match(schema[key])) { // RegEx constraint
               valid = false;
            } else if (type === Array && schema[key].indexOf(o[key]) <= -1) { // Set constraint
               valid = false;
            } else if (type === Object) { // Complex constraint
               if (schema[key].type !== fieldType) {
                  valid = false;
               } else {
                  if (fieldType === Number) {
                     if (schema[key].min !== undefined && o[key] < schema[key].min) {
                        valid = false;
                     }

                     if (schema[key].max !== undefined && o[key] > schema[key].max) {
                        valid = false;
                     }
                  } else if (fieldType === String) {
                     var len = o[key].length;

                     if (schema[key].min !== undefined && len < schema[key].min) {
                        valid = false;
                     }

                     if (schema[key].max !== undefined && len > schema[key].max) {
                        valid = false;
                     }

                     if (schema[key].pattern !== undefined && !o[key].match(pattern)) {
                        valid = false;
                     }
                  } else if (fieldType === Object) {
                     // recurse on fields
                  }
               }
            }
         }

         if (!valid) {
            return false;
         }
      }

      return true;
   }
}
