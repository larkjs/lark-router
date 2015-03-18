/**
 * Created by mdemo on 14/11/13.
 */
module.exports = function (router) {
    router.get('/', function *(next) {
        console.dir(this.mountPath);
        this.body = 'Hello Create';
        yield next;
    });
    return router;
};
