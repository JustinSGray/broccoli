urlSafe = function(str) {
  var base = str.trim();
  return base.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}