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

parseCaseData = function(data, cb){
  
};