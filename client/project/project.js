Template.project.proj = function(){
  return Session.get('project');
}

Template.project.events = ({
  'click #new-sim-form button': function(event, template) {
    var reader = new FileReader();
    reader.onload = function(evt) {
      var sim_data = $.parseJSON(evt.target.result);
      var nCases = sim_data.length;
    }

    var file = $(event.target).prev()[0].files[0];
    reader.readAsText(file, 'UTF-8');
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