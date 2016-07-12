/**
 * Created by pooyaparidel on 2016-06-13.
 */

var MojioClientLite= require("../src/MojioClientLite");

var config = {
    application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    secret:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};

var mojio_client = new MojioClientLite(config);

mojio_client.authorize('pooya.p@outlook.com','Pppmorva$123').then(function(res,err){

    if(typeof(err)!="undefined")
    {
        console.log("login error");
        return;
    }

    return mojio_client.refreshToken();


}).then(function(res,err){
    console.log("error");
    console.log(err);

    console.log("result");
    console.log(res);

    return mojio_client.get('/v2/me');

}).then(function(res,err){
    console.log("error");
    console.log(err);

    console.log("refresh");
    console.log(res);
})


