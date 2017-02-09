module.exports = function(source) {
  if (typeof this.cacheable === 'function') {
    this.cacheable()
  }

  return 'module.exports = (function(){ return ' + source + '})()'
};
