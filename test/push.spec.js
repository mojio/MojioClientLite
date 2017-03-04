"use strict";

var expect = require('chai').expect;

var MojioClientLite= require("../src/MojioClientLite");

describe('Mojio Client Push', function() {
    it('push part', function(done) {

        // Increase the default timeout for this test
        // If the test takes longer than this, it will fail
        this.timeout(3000);

        var config = {
            application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            secret:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        };

        var mojio_client = new MojioClientLite(config);


        var pushPart=mojio_client.push();

        expect(pushPart.mojios).to.be.an('function');
        done();
    });
});
