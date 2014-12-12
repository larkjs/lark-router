/**
 * Created by mdemo on 14/11/13.
 */
module.exports = function(router){
  router.get('/', function *(next){
    this.body = 'Hello MAC';
    yield next;
  });
  return router;
};
