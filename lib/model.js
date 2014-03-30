/////////////////////////////////////////////////////////
/// Deny Rules
/////////////////////////////////////////////////////////


var mustBeOwner = {
  insert: function(userId, doc) {
    console.log("HERE", userId); 
    if(userId===undefined){
      return true;
    }
    return false;
  },
  update: function(userId, doc) {
    if(userId!=doc.userId){
      return true;
    }
    return false;
  },
  remove: function(userId, doc) {
    if(userId!=doc.userId){
      return true;
    }
    return false;
  },
};


/////////////////////////////////////////////////////////
/// Allow Rules
/////////////////////////////////////////////////////////

var allowLoggedIn = {
  insert: function(userId, doc) {
    return userId !== null;
  },
  update: function(userId, doc) {
    return userId !== null;
  },
  remove: function(userId, doc) {
    return userId !== null;
  },
};


/////////////////////////////////////////////////////////
/// Project
/////////////////////////////////////////////////////////


Projects = new Meteor.Collection('projects');

Projects.allow(allowLoggedIn);

Projects.deny(mustBeOwner);

Projects.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.urlName = urlSafe(doc.name);
});



/////////////////////////////////////////////////////////
/// Simulations
/////////////////////////////////////////////////////////

Simulations = new Meteor.Collection('simulations');

Simulations.allow(allowLoggedIn);

Simulations.deny(mustBeOwner);

Simulations.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.created = Date.now();
});


