module.exports = function * (next) {
  this.body = 'Hello Generator';
  yield next;
}
