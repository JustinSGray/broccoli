
var assert = require('assert');

suite('Project functionality', function() {
  test('Error msg for no name', function(done, server, client) {
    client.eval(function() {
      waitForDOM('#new-project-form', function(){
        var form = $('#new-project-form');
        var formGroup = form.find('.form-group'); 

        // starts without error class, no error msg
        assert.equal(formGroup.hasClass('has-error'), false);
        assert.equal(form.find('.help-block').text(), "");

        form.find('button').click() //empty form
        emit('submitted');
        
      });
    }).once('submitted', function() {
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