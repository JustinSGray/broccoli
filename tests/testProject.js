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

suite('Project collection behavior', function() {
  test('inserts get a correct url-safe name', function(done, server, client) {

    var test = function() {
      server.eval(function(){
        Projects.find().observe({
          added: function(proj){
            emit(proj.name, proj);
          }
        });
      }).once('name with spaces', function(proj){
        console.
        assert(proj.safeName, 'name-with-spaces');
      }).once('name with "', function(proj){
        assert(proj.safeName, 'name-with');
      }).once('name with 123', function(proj){
        assert(proj.safeName, 'name-with-123');
      }).once('Name With CAPS', function(proj){
        assert(proj.safeName, 'name-with-caps');
        done();
      });

      client.eval(function(){
        Projects.insert({name:'name with spaces'});
        Projects.insert({name:'name with "'});
        Projects.insert({name:'name with 123'});
        Projects.insert({name:'Name With CAPS'});

       
      });

    };

    run_test(client, test);
  });
});
suite('Project creation behavior', function(){
  test('name availability', function(done, server, client) {

    var test = function() {
      client.eval(function(){
        emit('goodName', Regulate.Rules.projectNameAvail('test'));

        function false_emit_maker(num, name){ // makes emits for bad names
          var cb = function() {
            emit('badName'+num, Regulate.Rules.projectNameAvail(name));
          }

          return cb;
        }

        Projects.insert({name:'test', userId:Meteor.userId()}, false_emit_maker(1, 'test'));

        // should strip leading and trailing white space
        false_emit_maker(2, 'test ')();
        false_emit_maker(3, ' test ')();

      }).once('goodName', function(isAvail){
        assert.equal(isAvail, true);
      }).once('badName1', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName2', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName3', function(isAvail){
        assert.equal(isAvail, false);
        done();
      });
    };

    run_test(client, test);
  });
});