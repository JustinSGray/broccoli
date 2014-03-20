var assert = require('assert');

suite('username availability checking', function() {
  test('server side: when name is available', function(done, server, client) {
    var avail = server.evalSync(function() {
      var is_avail = Regulate.Rules.nameAvail('test');
      emit('return', is_avail);
    });

    assert.equal(avail, true);
    done();
  });

  test('server side: when name is not available', function(done, server, client) {

    var avail = server.evalSync(function() {
      Accounts.createUser({username: 'test', password: '123456'});

      var is_avail = Regulate.Rules.nameAvail('test');
      emit('return', is_avail);
    });

    assert.equal(avail, false);
    done();
  });

  test('client side: when name is available', function(done, server, client) {
    var avail = client.evalSync(function() {
      var is_avail = Regulate.Rules.nameAvail('test');
      emit('return', is_avail);
    });

    assert.equal(avail, true);
    done();
  });

  test('client side: when name is not available', function(done, server, client) {
    
    client.eval(function() {

      var loggedOutCb = function() {
        console.log("Hello:  ", Meteor.users.find().count());
        var is_avail = Regulate.Rules.nameAvail('test');
        emit('created', is_avail);
      }

      var createdCb = function(error){
        Meteor.logout(loggedOutCb);
      }
      Accounts.createUser({username: 'test', password: '123456'}, createdCb);
    }).once('created', function(is_avail){
      assert.equal(is_avail, false);
      done();
    });

    //done();
  });

});