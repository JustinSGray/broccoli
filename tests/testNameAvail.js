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

    var avail = server.eval(function() {
      Accounts.createUser({username: 'test', password: '123456'});

      emit('userCreated');    
    });

    client.once('userCreate', function() {
      var is_avail = Regulate.Rules.nameAvail('test');
      assert.equal(avail, false);
    });

    done();
  });

});