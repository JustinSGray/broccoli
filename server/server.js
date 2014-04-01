Meteor.publish('userProjects', function(){
  if (this.userId) {
     return Projects.find({userId: this.userId});
  } else {
    this.ready();
  }
});


Meteor.publish('userData', function(){
  return Meteor.users.find({},{fields: {'username': 1}});
});


Meteor.publish('simulations', function(projectId){
  return Simulations.find({projectId:projectId});
});