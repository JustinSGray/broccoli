
var assert = require('assert');


function setup(client, cb) {
  client.eval(function() {

    function cb() {
      emit('userCreated');
    }

    Accounts.createUser({username:'test', password: '123456'}, cb);
  });
}

suite('Project functionality', function() {

  test('Project name availability', function(done, server, client) {

    setup(client);

    client.once('userCreated', function() {
      var isAvail = client.eval(function(){
        emit('goodName', Regulate.Rules.projectNameAvail('test'));

        function cb() {
          emit('badName', Regulate.Rules.projectNameAvail('test'));
        }
        Projects.insert({name:'test', userId:Meteor.userId()}, cb);

      }).once('goodName', function(isAvail){
        assert.equal(isAvail, true);
      }).once('badName', function(isAvail){
        assert.equal(isAvail, false);
        done();
      });
    });
  });

  test('Error msg for no name', function(done, server, client) {

    setup(client);

    client.once('userCreated', function(){ 
      client.eval(function(){
        waitForDOM('#new-project-form', function(){
          var form = $('#new-project-form');
          var formGroup = form.find('.form-group'); 
    
          // starts without error class, no error msg
          emit('hasClass',formGroup.hasClass('has-error'));
          emit('helpText', form.find('.help-block').text());

          form.find('button').click() //empty form
          emit('submitted');
          emit('return');
        });
      }).once('hasClass', function(hasClass){
        assert.equal(hasClass, false);
      }).once('helpText', function(helpText){
        assert.equal(helpText, '');
      });
      
    });

    client.once('submitted', function() {
      // should get error class and report error message
      assert.equal(formGroup.hasClass('has-error'), true);
      assert.equal(form.find('.help-block').text(), "Provide a name for the project.");
    
      done();
    });

  });

  test('Valid name creates a project', function(done, server, client) {
    client.eval(function() {
      var form = $('#new-project-form');
      form.find('input[name=project-name]').val('foobar');

      form.find('button').click() //empty form
      emit('submitted');
    }).once('submitted', function(){
      // Should show up in the list of projects, with the proper name
      done();
    });

  });
});