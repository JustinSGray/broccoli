Template.project.proj = function(){
  return Session.get('project');
}

Template.project.simulations = function(){
  return Simulations.find().fetch()
}


Template.project.events = ({
  'click #new-sim-form button': function(event, template) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      var projId = Session.get('project')._id;

      var cb = function(error, result) {
        $(event.target).prev().val('');
      }

      parseSimData(projId, evt.target.result, null, cb);
    }

    var file = $(event.target).prev()[0].files[0];
    reader.readAsText(file, 'UTF-8');
  }, 
  'change #sim-select': function(event, template) {
    var sim = Simulations.findOne({_id:event.currentTarget.value})
    Session.set('simulation', sim);
    Session.set('simulationId', sim._id);
  }
});

// asyncronous method used to turn case data file 
//   into a simulation and set of associated cases. 
//   if given, cb will be called with the id of the new Simulation
parseSimData = function(projectId, data, name, cb){
  
  var simCb = function(error, simId) {
    //console.log("there",error, cb);

    if (error && cb) {
      cb(error, null);
      return;
    }
    // add all the cases to the simulation
    var jsonData = $.parseJSON(data);
    var i, caseData;
    // all but the last case
    //console.log("there", simId);

    for (i=0;i<jsonData.length-1; ++i){
      caseData = jsonData[i];
      caseData.simId = simId;
      //console.log("simId", sim)
      Cases.insert(caseData);
    }
    caseData = jsonData[i];
    caseData.simId = simId;

    var finalCb = function(error, caseId){
      //console.log('finalCb:', error, simId ,caseId);
      if (error && cb) {
        cb(error, null);
        return;
      }
      else if (cb) {
        cb(null, simId);
      } 
    }
    Cases.insert(caseData, finalCb);
  }

  // make a new simulation
  Simulations.insert({name:name, projectId:projectId}, simCb);  
};