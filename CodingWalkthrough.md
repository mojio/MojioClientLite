# JavaScript Coding Walkthrough #

In order to make use of the code samples below you will first need to have a new app project set up. To set up a new app project go to the Create New App page. Once you have created a new application, you will need the AppID in order to initiate any API calls through our SDK.

### INSTALLING THE SDK ###
First you will want to download SDK libraries. You can do it manually or by NPM or Bower. There is no package name for NPM or Bower yet but you can install it by GIT endpoint:
```
npm install https://github.com/mojio/MojioClientLite --save

or

bower install https://github.com/mojio/MojioClientLite.git --save
```

### INITIALIZING THE SDK (Client Side) ###

Once you have included the SDK, connecting to our API is as simple as:
```
<script src="MojioClientLite.js"></script>
<script>
    var config = {
        application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // your application ID
    };
    mojio_client = new MojioClientLite(config);
</script>
```
"application" is the only mandatory option in config. But if you want more control you can modify the other options:
```
    var config = {
      application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // your application ID
      environment: '' // staging, develope, ...
      accountsURL: 'accounts.moj.io'
      apiURL: 'api.moj.io'
      pushURL: 'push.moj.io'
      redirect_uri:"your application redirect url", //it will be current url if not specify
      scope:'full'
      acceptLanguage:'en'
    }
```

### INITIALIZING THE SDK (Back End)###

First you will want to download SDK libraries. Once you have downloaded and included the SDK, connecting to our API is as simple as:
```
var MojioClientLite= require("MojioClientLite");

var config = {
    application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    secret:'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
};

var mojio_client = new MojioClientLite(config);
```

"application" and "secret" are the only mandatory option in config. But if you want more control you can modify the other options:
```
    var config = {
      application: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // your application ID
      secret:  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // your application secret
      environment: '' // staging, develope, ...
      accountsURL: 'accounts.moj.io'
      apiURL: 'api.moj.io'
      pushURL: 'push.moj.io'
      scope:'full'
      acceptLanguage:'en'
    }
```

### AUTHENTICATING A MOJIO USER (Client Side) ###
Many of our API calls require an authorized user to be associated with the SDK requests. In order to authenticate a user, you must redirect to the Mojio authentication server.

```
    if (mojio_client.token())
    {
        alert("Authorization Successful.");
        // Here you can call API calls for authorized user
    }
    else
    {
        // No authorized user, redirect to Mojio authentication server.
        mojio_client.authorize();
    }
```

### LOGOUT (Client Side) ###
It's similar to authorize(), the only difference is it force the current user logout and then it will show login form again.

```
        mojio_client.logout();
```

### AUTHENTICATING A MOJIO USER (Back End) ###
Many of our API calls require an authorized user to be associated with the SDK requests. In order to authenticate a user.

```
    mojio_client.authorize('username or email','password').then(function(res,err){

        if(typeof(err)!="undefined")
        {
            console.log("login error");
            return;
        }

        // login successful
        // write your logic here
    })
```

### REFRESH TOKEN ###
Token will expire after 12 hours. To receive new token:
```
        mojio_client.refreshToken();
```

### STORING TOKEN ###
Token will store in memory by default, but it's easy to configure to store in other storage (like sessionStorage or localStorage). To do so you need to change it in config:
```
var config = {
    ...
    dataStorage:sessionStorage, // sessionStorage or localStorage
    ...
};

var mojio_client = new MojioClientLite(config);
```

### FETCHING DATA ###
get() method provide many sub methods to receive list of objects. Here is the list of calls for receiving data:
```
mojio_client.get().me() //Fetching Authorized user
mojio_client.get().users() //Fetching users
mojio_client.get().mojios() //Fetching mojios (devices)
mojio_client.get().vehicles() //Fetching vehicles
mojio_client.get().apps() //Fetching apps
mojio_client.get().groups() //Fetching groups
mojio_client.get().trips() //Fetching trips
mojio_client.get().geofences() //Fetching Geofences
```
### GETTING A SPECIFIC ENTITY ###
If you want to retrieve a specific entity, for example a Mojio, user, trip or event, you can pass in the entity ID:
```
mojio_client.get().user(id) //Fetching specefic user data
mojio_client.get().mojio(id) //Fetching specefic mojio data
mojio_client.get().vehicle(id) //Fetching specefic vehicle data
mojio_client.get().app(id) //Fetching specefic app data
mojio_client.get().group(id) //Fetching specefic group data
mojio_client.get().trip(id) //Fetching specefic trip data
mojio_client.get().geofence(id) //Fetching specefic geofence data
```

Examples:
```
// Fetching list of Mojio devices
mojio_client.get().mojios().then(function(res,err){
        // if err is null then data will be inside res
}

// Fetching one specefic device data
mojioId='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' // Id of device you want to fetch
mojio_client.get().mojio(mojioId).then(function(res,err){
        // if err is null then data will be inside res
}
```
### CUSTOMIZING FETCHING DATA ###
When you are making call, you can specify these conditions:
- Top: The maximum number of records to return.
- Skip: The number of records to skip before it retrieves records in a collection.
- filter: Specifies an expression or function that must evaluate to true for a record to be returned in the collection.
- Select: Specifies a subset of properties to return.
- Orderby: Determines what values are used to order a collection of records.

There is a helper method for cutomization:
```
// Fetching list of Mojio devices
custom=mojio_client.query()
    .top(10)
    .skip(2)
    .filter("your filter")
    .select("list of fields")
    .orderby("something");

mojio_client.get().vehicles(custom).then(function(res,err){
        // if err is null then data will be inside res
}
```

### ADVANCE FETCHING DATA ###
In addition to all method for fetching data you can use getPath method to call any GET Api call to Mojio:
```
// getPath(url,data)
// Fetching list of Mojio devices
mojio_client.getPath('/v2/mojios').then(function(res,err){
        // if err is null then data will be inside res
}
```
Also it's handy for calling V1 api:
```
mojio_client.getPath('/v1/users/me').then(function(res,err){
        // if err is null then data will be inside res
}
```
### SAVING AN EXISTING ENTITY ###
If you want to update and save an entity, you need to first load the entity from the API, make your changes, and then save it back. Typically only the owner of an entity will be authorized to save changes and not all properties of an entity will be editable (for example, for an App, only the Name and Description properties can be changed).
```
    // This example reterive list of vehicles and then change the title of the first vehicle and save it.
    mojio_client.get().vehicles().then(function(res,err){
        v=res.Data[0]
        v.Name="new vehicle name"
        mojio_client.vehicle(v).put().then(function(res,err) {
            console.log("error");
            console.log(err);

            console.log("new put result");
            console.log(res);
        });
    });
```
### DELETING AN EXISTING ENTITY ###
If you want to delete an entity from the Mojio API, a delete call must be made. Typically only the owner of an entity will be authorized to delete an entity, and not all entities can be deleted.

```
    // This example reterive list of trips and then selete the first trip.
    mojio_client.get().trips().then(function(res,err){

        mojio_client.vehicle(res.Data[0]).delete().then(function(res,err) {
            console.log("error");
            console.log(err);

            console.log("delete result");
            console.log(res);
        });
    });
```

### GETTING A LIST OF CHILD ENTITIES ###
For example, if you want to fetch the Trips associated with a Vehicle:
```
    mojio_client.get().vehicles().then(function(res,err){
        mojio_client.vehicle(res.Data[0]).trips().then(function(res,err) {
            console.log("error");
            console.log(err);

            console.log("result");
            console.log(res);
        });
    });
```

### GETTING DATA WITH WebSocket (PUSH) (Client Side) ###
Mojio allows developers to receive data on Entity changes (Mojios,Vehicle) so instead of pulling data server can push changes to client.
```
websocket=mojio_client.push(url)

websocket=mojio_client.push().mojios()
//observing all mojio devices (you can call mojio_client.push('/v2/mojios') instead)

websocket=mojio_client.push().mojio(id)
//observing one mojio device by passing device id (you can call mojio_client.push('/v2/mojios/' + id) instead)

websocket=mojio_client.push().vehicles()
//observing all vehicles (you can call mojio_client.push('/v2/vehicles') instead)

websocket=mojio_client.push().vehicles(id)
//observing one vehicle by passing vehicle id (you can call mojio_client.push('/v2/vehicles/' + id) instead)


websocket.onopen = function(){
    // do something onopen event
}

websocket.onclose = function(){
    // do something onclose event
}

websocket.onerror = function(error){
    // do something onerror event
    // console.log(error)
}

websocket.onmessage = function(e){
    // do something onmessage event
    // console.log(e)
}

//closing the connection
websocket.close()


```

### GETTING DATA WITH WebSocket (PUSH) (Server Side) ###
Mojio allows developers to receive data on Entity changes (Mojios,Vehicle) so instead of pulling data server can push changes to client.
```
websocket=mojio_client.push(url)

websocket=mojio_client.push().mojios()
//observing all mojio devices (you can call mojio_client.push('/v2/mojios') instead)

websocket=mojio_client.push().mojio(id)
//observing one mojio device by passing device id (you can call mojio_client.push('/v2/mojios/' + id) instead)

websocket=mojio_client.push().vehicles()
//observing all vehicles (you can call mojio_client.push('/v2/vehicles') instead)

websocket=mojio_client.push().vehicles(id)
//observing one vehicle by passing vehicle id (you can call mojio_client.push('/v2/vehicles/' + id) instead)

websocket.on('open', function open() {
    // do something onopen event
});

websocket.on('message', function(data, flags) {
    // do something onmessage event
    // console.log(data)
});

websocket.on('close', function close() {
   // do something onclose event
});

websocket.close()


```

### CREATING HTTPPOST OBSERVER ###
Mojio allows developer receive data on Entity changes by HTTP POST. So in addition to listening to HTTP post (for example by express) you need to define observer:
```
data={
    "Key" : "square",
    "Conditions": "Location.Lat gt 91.987 and Location.Lat lt 92.83738 and Location.Lng lt -120.28378 and Location.Lng gt -121.23873",
    "Timing": "Leading",
    "Transports" : [
        {
            "Type" : "HttpPost",
            "Address" : "https://b940657a.ngrok.io/observer_callback" //change it to your listening url
        }
    ]
}

mojio_client.post("https://push.moj.io/v2/vehicle",data).then(function(res,err){
	// if err is null then observer created successfully.
}
```