assert = require('assert');
_ = require('underscore');

runTestWithUser = function(client, ready) {
  client.eval(function() {
    function cb() {
      emit('userCreated');
    }

    Accounts.createUser({username:'test', password: '123456'}, cb);
  });

  if (ready!=undefined) {
    client.once('userCreated', ready);
  }
}