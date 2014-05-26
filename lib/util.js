urlSafe = function(str) {
  var base = str.trim();
  return base.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}


getDataCols = function(caseSet) {
  // currently need to loop over the whole set to get data ... fix this
  var nCases = caseSet.length; 
  var cols = {}
  for (var i=0; i<nCases; ++i) {

  }
}



