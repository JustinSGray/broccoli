
Template.dashboard.events = {
  'click #new-project': function(event){
    
  }
}


Meteor.startup(function(){

  Regulate['#new-project-form'].onSubmit(function(error, data){
    if(error) {
      set_form_errors(error);
      return false;
    }

    //console.log('Create New Project!!  ' + data[0].value);
    var projName = data[0].value;
    Projects.insert({name:projName, userId:Meteor.userId()});

  });
});