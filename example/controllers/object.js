var router = module.exports = { get : {} };

router.get['/'] = function * (next) {
  this.body = 'Hello Object';
  yield next;
}
