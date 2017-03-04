var expect = require('chai').expect;

var MojioClientLite= require("../src/MojioClientLite");

describe('Mojio Client initial', function() {
    it('default client config', function(done) {

        // Increase the default timeout for this test
        // If the test takes longer than this, it will fail
        this.timeout(3000);

        var config = {
            application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            secret:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
        };

        var mojio_client = new MojioClientLite(config);

        // Ensure that default config is good
        expect(mojio_client.config.environment).to.equal('');
        expect(mojio_client.config.accountsURL).to.equal('https://accounts.moj.io');
        expect(mojio_client.config.apiURL).to.equal('https://api.moj.io');
        expect(mojio_client.config.pushURL).to.equal('https://push.moj.io');
        expect(mojio_client.config.wsURL).to.equal('wss://api.moj.io');
        expect(mojio_client.config.redirect_uri).to.equal('');
        expect(mojio_client.config.scope).to.equal('full');
        expect(mojio_client.config.acceptLanguage).to.equal('en');
        expect(mojio_client.config.dataStorage).to.be.an('object');
        expect(mojio_client.config.tokenRequester).to.be.an('function');

        done();

    });
});
