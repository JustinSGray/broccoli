var assert = require('assert');
var _ = require('underscore');

function run_test(client, ready) {
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




suite('Simulation upload into a project', function(){});