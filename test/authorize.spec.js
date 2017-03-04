"use strict";

var expect = require('chai').expect;

var MojioClientLite= require("../src/MojioClientLite");

describe('Mojio Client authorize', function() {
    it('authorization part', function(done) {

        // Increase the default timeout for this test
        // If the test takes longer than this, it will fail
        this.timeout(3000);

        var config = {
            application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            secret:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        };

        var mojio_client = new MojioClientLite(config);


        mojio_client.authorize('username','password').then(function(res,err){
            done();

        }).catch(function(err){

            expect(err).to.be.not.an('undefined');
            done();

        });


    });
});
