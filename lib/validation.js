
Regulate.registerRule('name_avail', function (fieldValue, fieldReqs, fields) {
  fieldValue = fieldValue.toLowerCase();
  var isUnique = Meteor.users.findOne({username:fieldValue});
  var current_user = Meteor.user();
  if (current_user && current_user.username==fieldValue) {
    return true;
  }
  return (isUnique==undefined); // true or false.
});

Regulate.registerMessage('name_avail', function (fieldName, fieldReqs) {
  return fieldName + " is taken! choose another name or enter the correct password";
});

Regulate('#sign_up_form', [
    {
        name: 'username', 
        min_length: 4, 
        name_avail: true,
    },
    {
        name: 'password', 
        min_length: 4,
    }
]);


