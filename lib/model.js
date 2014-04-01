/////////////////////////////////////////////////////////
/// Deny Rules
/////////////////////////////////////////////////////////


var mustBeOwner = {
  insert: function(userId, doc) {
    //console.log("HERE", userId); 
    if(userId===null){
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

var allowAll = {
  insert: function(userId, doc) {
    return true;
  },
  update: function(userId, doc) {
    return true;
  },
  remove: function(userId, doc) {
    return true;
  },
};


/////////////////////////////////////////////////////////
/// Project
/////////////////////////////////////////////////////////


Projects = new Meteor.Collection('projects');

Projects.allow(allowAll);

Projects.deny(mustBeOwner);

Projects.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.urlName = urlSafe(doc.name);
});



/////////////////////////////////////////////////////////
/// Simulations
/////////////////////////////////////////////////////////

Simulations = new Meteor.Collection('simulations');

Simulations.allow(allowAll);

Simulations.deny(mustBeOwner);
Simulations.deny({
  insert: function(userId, doc) {
    if (doc.projectId === undefined)  {
      return true;
    }
    return false;
  }
});

Simulations.before.insert(function(userId, doc){
  doc.userId = userId;
  doc.created = Date.now();
});


/////////////////////////////////////////////////////////
/// Simulations
/////////////////////////////////////////////////////////

Cases = new Meteor.Collection('cases');

Cases.allow(allowAll);

Cases.deny(mustBeOwner);
Cases.deny({
  insert: function(userId, doc){
    console.log("testing", userId, doc);
    var sim = Simulations.findOne({_id:doc.simId});
    if (!sim) {
      return true; //sim doesn't exist
    }
    if (sim.userId !== userId) {
      return true; //has to own simulation
    }
    return false;
  }
});


