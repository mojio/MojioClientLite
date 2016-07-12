/**
 * Created by pooyaparidel on 2016-06-10.
 */

if( typeof mymodule === 'undefined' ) {
    var mymodule = require('..')
}

describe('mymodule', function(){

    it('something must be done', function(){
        expect( mymodule() ).toBe( 'doing something' )
    })

})