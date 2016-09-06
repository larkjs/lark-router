/**
 * Tests for simple use of router
 **/
'use strict';

const debug   = require('debug')('lark-router.test.simple');

const Router  = require('..');

describe('lark-router instance', () => {
    const router = new Router();

    it('should be an object with route methods', done => {
        router.should.have.property('_routes').which.is.an.instanceOf(Array);
        router.should.have.property('route').which.is.an.instanceOf(Function).with.lengthOf(2);
        router.should.have.property('switch').which.is.an.instanceOf(Function);
        router.should.have.property('dispatch').which.is.an.instanceOf(Function);
        router.should.have.property('match').which.is.an.instanceOf(Function);
        router.should.have.property('execute').which.is.an.instanceOf(Function);
        done();
    });

    it('should add routing rules', done => {
        const output = [];
        const handler = num => { output.push(num); };
        router.route(1, handler);
        router.route(2, handler);
        router.route(3, handler);
        router.route(4, handler);
        router.route(5, handler);
        router.route(6, handler);

        const testList = [4, 3, 2, 6, 5, 4, 3, 2, 1];
        const taskList = [];
        for (let num of testList) taskList.push(router.dispatch(num));

        Promise.all(taskList).then(() => {
            output.should.have.property('length', testList.length);
            for (let i = 0; i < testList.length; i++) {
                output[i].should.be.exactly(testList[i]);
            }

            done();
        });
    });

    it('should proxy to mounting routers', done => {
        const main = new Router();
        const sub  = new Router();

        main.match = (condition, target) => {
            return parseInt(target / 10, 10) === condition;
        };

        sub.match = (condition, target) => {
            return parseInt(target % 10, 10) === condition;
        };

        let output = 0;

        main.route(1, sub);
        sub.route(1, () => { output = 1; });
        sub.route(2, () => { output = 2; });

        main.dispatch(12).then(() => {
            output.should.be.exactly(2);
            done();
        }).catch(e => console.log(e.stack));
    });
});
