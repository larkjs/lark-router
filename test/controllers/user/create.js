/**
 * Created by mdemo on 14/11/13.
 */
module.exports = function(router){
  router.get('/', function *(){
    this.body = 'Hello Create';
  });
  return router;
};
