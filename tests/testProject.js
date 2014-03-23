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
        assert(proj.urlName, 'name-with-spaces');
      }).once('name with "', function(proj){
        assert(proj.urlName, 'name-with');
      }).once('name with 123', function(proj){
        assert(proj.urlName, 'name-with-123');
      }).once('Name With CAPS', function(proj){
        assert(proj.urlName, 'name-with-caps');
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
  test('for name availability', function(done, server, client) {

    var test = function() {
      client.eval(function(){
        emit('goodName', Regulate.Rules.projectNameAvail('test test'));

        function false_emit_maker(num, name){ // makes emits for bad names
          var cb = function() {
            emit('badName'+num, Regulate.Rules.projectNameAvail(name));
          }

          return cb;
        }

        Projects.insert({name:'test test', userId:Meteor.userId()}, false_emit_maker(1, 'test test'));

        // should strip leading and trailing white space
        false_emit_maker(2, 'test test ')();
        false_emit_maker(3, ' test test ')();
        false_emit_maker(4, 'test-test')();

      }).once('goodName', function(isAvail){
        assert.equal(isAvail, true);
      }).once('badName1', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName2', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName3', function(isAvail){
        assert.equal(isAvail, false);
      }).once('badName4', function(isAvail){
        assert.equal(isAvail, false);
        done();
      });
    };

    run_test(client, test);
  });
});

suite('Project Page', function(){
  test('loading', function(done, server, client){

    var test = function() {
      client.eval(function(){

        var cb = function(){
          emit('projectCreated');
        }
        Projects.insert({name:'test test', userId:Meteor.userId()}, cb);
      
      }).once('projectCreated', function(){
        client.eval(function(){
          Router.go('/projects/test-test');
          emit('projName', Template.project.proj().name);
        });
      }).once('projName', function(name){
        assert.equal(name, 'test test');
        done();
      });
    }

    run_test(client, test);
  });
});