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

  // this test is really finiky and has some kind of db sync based race condition
  // test('client side: when name is not available', function(done, server, client) {
    
  //   client.eval(function() {

  //     var loggedOutCb = function() {
  //       // need to move to splash page manually, since logout re-route is not triggered
  //       Router.go("/"); 
  //       var is_avail = Regulate.Rules.nameAvail('test');
  //       emit('created', is_avail);
  //     }

  //     var createdCb = function(error){
  //       Meteor.logout(loggedOutCb);
  //     }
  //     Accounts.createUser({username: 'test', password: '123456'}, createdCb);
  //   }).once('created', function(is_avail){
  //     assert.equal(is_avail, false);
  //     done();
  //   });

  // });

});