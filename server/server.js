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
  proj = Projects.findOne({_id:projectId});
  if (proj.userId === this.userId){
    return Simulations.find({projectId:projectId});
  }
  else {
    this.ready();
  }
});