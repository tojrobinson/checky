module.exports = function(schema) {
   schema = schema || {};
   var schemaFields = Object.keys(schema);

   return function(o) {
      if (!o || o.constructor !== Object) return false;

      for (var i = 0; i < schemaFields.length; ++i) {
         var field = schemaFields[i];
         var validType = schema[field].constructor;
         var valid = true;

         if (!o.hasOwnProperty(field)) {
            if (!schema[field].optional) {
               valid = false;
            }
         } else {
            var type = o[field].constructor;
            if (validType === Function && schema[field] !== type) {
               valid = false;
            } else if (validType === RegExp && !o[field].match(schema[field])) {
               valid = false;
            } else if (validType === Object) {
               if (schema[field].type !== type) {
                  valid = false;
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
