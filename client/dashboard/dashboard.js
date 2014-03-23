Template.dashboard.projects = function(){
  return _.map(Projects.find().fetch(), function(proj) {
    proj.url = Router.routes['project'].path({urlName: proj.urlName});
    return proj;
  });
}

// Form Validation
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