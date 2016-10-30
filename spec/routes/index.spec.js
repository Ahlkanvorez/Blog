(function () {
    'use strict';

    var request = require('request');
    var base_url = "http://localhost:3000/";

    describe('Blog Server, Index route', function () {
        describe('GET /', function () {
            it('returns status code 200', function (done) {
                request(base_url, function (err, res, body) {
                    expect(res.statusCode).toBe(200);
                    done();
                });
            });
        });

        describe('GET /admin', function () {
            it('returns status code 403', function (done) {
                request(base_url + 'admin', function (err, res, body) {
                    expect(res.statusCode).toBe(403);
                    done();
                });
            });
        });
    });
})();