class @MojioClientLite
  _this = @

  @extend : (target) ->
    sources = [].slice.call(arguments, 1)
    sources.forEach (source) ->
      for prop of source
        target[prop] = source[prop]
      return
    target

  ACCESSTOKENSTORAGE='ACCESSTOKEN'

  constructor: (conf) ->

    defConfig={
      environment: ''
      accountsURL: 'https://accounts.moj.io'
      apiURL: 'https://api.moj.io'
      pushURL: 'https://push.moj.io'
      redirect_uri:window.location.href.replace('http:','https:').split('#')[0],
      scope:'admin'
      acceptLanguage:'en'
    }

    @config = @constructor.extend({},defConfig,conf)
    if @config.environment!=''
      @config.accountsURL=@config.environment + '-' + @config.accountsURL
      @config.apiURL=@config.environment + '-' + @config.apiURL
      @config.pushURL=@config.environment + '-' + @config.pushURL

  authorize:()=>
    url=@config.accountsURL + '/OAuth2/authorize' + '?response_type=token&client_id=' + @config.application + '&redirect_uri=' +  @config.redirect_uri + '&scope=' + @config.scope

    window.location.href=url

  token:()=>
    param = window.location.toString().split('#')[1]
    found=false

    if typeof(param) != 'undefined' && param.indexOf('access_token=')!=-1
      try
        access_token = document.location.hash.match(/access_token=([0-9a-f-]{36})/)[1]

        if access_token
          @config.access_token = access_token
          sessionStorage.setItem(ACCESSTOKENSTORAGE, @config.access_token)
          found=true

      catch e
          found=false
    else
      temp = sessionStorage[ACCESSTOKENSTORAGE]
      if temp? && temp!=null && temp.length != 0
        @config.access_token = temp
        found=true

    return found


  header:()=>
    return {
      'Accept': 'application/json'
      'Authorization': 'Bearer ' + @config.access_token
      'Accept-Language': @config.acceptLanguage
      'Content-Type':'application/json'
    }

  getMethods:()=>
    g=@getPath
    {
      me:(data,header)=>
        return g('/v2/me',data,header)
      users:(data,header)=>
        return g('/v2/users',data,header)
      mojios:(data,header)=>
        return g('/v2/mojios',data,header)
      vehicles:(data,header)=>
        return g('/v2/vehicles',data,header)
      apps:(data,header)=>
        return g('/v2/apps',data,header)
      groups:(data,header)=>
        return g('/v2/groups',data,header)
      trips:(data,header)=>
        return g('/v2/trips',data,header)
      geofences:(data,header)=>
        return g('/v2/geofences',data,header)

      user:(id)->
        return g('/v2/users/' + id)
      mojio:(id)=>
        return g('/v2/mojios/'+ id)
      vehicle:(id)=>
        return g('/v2/vehicles/'+ id)
      app:(id)=>
        return g('/v2/apps/'+ id)
      group:(id)=>
        return g('/v2/groups/'+ id)
      trip:(id)=>
        return g('/v2/trips/'+ id)
      geofence:(data,header)=>
        return g('/v2/geofences/' + id)

    }

  getPath:(path,data)=>
    url=@config.apiURL + path
    if !data?
      data={}
    header=@header()

    p = new promise.Promise();

    promise.get(url,data,header).then((error, text, xhr)->
      if (error)
        p.done(xhr.status, null);

      p.done(null, JSON.parse(text));
    )
    return p

  get:()=>

    if arguments.length==0
      return @getMethods()

    else if typeof(arguments[0])=="string"
      path=arguments[0]

      data={}
      if arguments.length>=1
        data=arguments[1]

      @getPath(arguments[0],data)

  put:(path,data)=>
    url=@config.apiURL + path
    if !data?
      data={}
    header=@header()

    p = new promise.Promise();

    promise.put(url,data,header).then((error, text, xhr)->
      if (error)
        p.done(xhr.status, null);

      p.done(null, JSON.parse(text));
    )
    return p

  post:(path,data)=>
    url=@config.apiURL + path
    if !data?
      data={}
    header=@header()

    p = new promise.Promise();

    promise.put(url,data,header).then((error, text, xhr)->
      if (error)
        p.done(xhr.status, null);

      p.done(null, JSON.parse(text));
    )
    return p

  delete:(path)=>
    url=@config.apiURL + path

    header=@header()

    p = new promise.Promise();

    promise.delete(url).then((error, text, xhr)->
      if (error)
        p.done(xhr.status, null);

      p.done(null, JSON.parse(text));
    )
    return p

  permissions:(path,oid)=>
    {
      get:()=>
        @getPath(path + '/' + oid + '/permissions')
      delete:()=>
        @delete(path + '/' + oid + '/permissions')
      put:(data)=>
        @put(path + '/' + oid + '/permissions',data)
      post:(data)=>
        @post(path + '/' + oid + '/permissions',data)
    }

  image:(path,oid)=>
    {
      get:()=>
        @getPath(path + '/' + oid + '/image')
      delete:()=>
        @delete(path + '/' + oid + '/image')
      put:(data)=>
        @put(path + '/' + oid + '/image',data,{'Content-Type':'multipart/form-data'})
      post:(data)=>
        @post(path + '/' + oid + '/image',data,{'Content-Type':'multipart/form-data'})
    }

  tags:(path,oid)=>
    {
      delete:(tag)=>
        @delete(path + '/' + oid + '/tags/' + tag)
      post:(tag)=>
        @post(path + '/' + oid + '/tags/' + tag)

    }

  app:(appObj)=>
    g=@getPath
    p='/v2/apps'

    {
      put:()=>
          @put(p + '/'  + appObj.Id,appObj)

      post:()=>
        @post(p,appObj)

      delete:()=>
        @delete(p + '/'  + appObj.Id)

      secret:()=>
        {
          get:()=>
            g(p + '/' + appObj.Id + '/secret')
          delete:()=>
            @delete(p + '/' + appObj.Id + '/secret')
        }

      image:()=>
        @image(p,appObj.Id)

      permission:()=>
        g(p + '/' + appObj.Id + '/permission')

      permissions:()=>
        @permissions(p,appObj.Id)

      tags:()=>
        @tags(p,appObj.Id)
    }

  vehicle:(vehObj)=>
    g=@getPath
    p='/v2/vehicles'
    {
      put:()=>
        @put(p + '/'  + vehObj.Id,vehObj)

      post:()=>
        @post(p,vehObj)

      delete:()=>
        @delete(p + '/'  + vehObj.Id)

      address:()=>
        g(p + '/' + vehObj.Id + '/address')

      trips:(data)=>
        g(p + '/' + vehObj.Id + '/trips',data)

      vin:()=>
        g(p + '/' + vehObj.Id + '/vin')

      serviceschedule:()=>
        g(p + '/' + vehObj.Id + '/serviceschedule')

      serviceschedulenext:()=>
        g(p + '/' + vehObj.Id + '/serviceschedulenext')

      history:()=>
        {
          states:()=>
            g(p + '/' + vehObj.Id + '/history/states')
          locations:()=>
            g(p + '/' + vehObj.Id + '/history/locations')
        }

      image:()=>
        @image(p,vehObj.Id)

      permission:()=>
        g(p + '/' + vehObj.Id + '/permission')

      permissions:()=>
        @permissions(p,vehObj.Id)

      tags:()=>
        @tags(p,vehObj.Id)

    }

  user:(userObj)=>
    g=@getPath
    p='/v2/users'
    {
      put:()=>
        @put(p + '/'  + userObj.Id,userObj)

      post:()=>
        @post(p,userObj)

      delete:()=>
        @delete(p + '/'  + userObj.Id)

      vehicles:()=>
        g(p + '/' + userObj.Id + '/vehicles')

      mojios:()=>
        g(p + '/' + userObj.Id + '/mojios')

      trips:()=>
        g(p + '/' + userObj.Id + '/trips')

      groups:()=>
        g(p + '/' + userObj.Id + '/groups')

      image:()=>
        @image(p,userObj.Id)

      permission:()=>
        g(p + '/' + userObj.Id + '/permission')

      permissions:()=>
        @permissions(p,userObj.Id)

      tags:()=>
        @tags(p,userObj.Id)
    }

  geofence:(gfObj)=>
    g=@getPath
    p='/v2/geofences'
    {
      put:()=>
        @put(p + '/'  + gfObj.Id,gfObj)

      post:()=>
        @post(p,gfObj)

      delete:()=>
        @delete(p + '/'  + gfObj.Id)

    }

  group:(grpObj)=>
    g=@getPath
    p='/v2/groups'

    {
      put:()=>
        @put(p + '/'  + grpObj.Id,grpObj)

      post:()=>
        @post(p,grpObj)

      delete:()=>
        @delete(p + '/'  + grpObj.Id)

      users:()=>
        {
          get:()=>
            g(p + '/' + grpObj.Id + '/users')
          delete:()=>
            @delete(p + '/' + grpObj.Id + '/users')
          put:(data)=>
            @put(p + '/' + grpObj.Id + '/users',data)
          post:(data)=>
            @post(p + '/' + grpObj.Id + '/users',data)
        }

      permission:()=>
        g(p + '/' + grpObj.Id + '/permission')

      permissions:()=>
        @permissions(p,grpObj.Id)

      tags:()=>
        @tags(p,grpObj.Id)
    }

  trip:(tripObj)=>
    g=@getPath
    p='/v2/trips'

    {
      put:()=>
        @put(p + '/'  + tripObj.Id,tripObj)

      delete:()=>
        @delete(p + '/'  + tripObj.Id)

      history:()=>
        {
          states:()=>
            g(p + '/' + tripObj.Id + '/history/states')
          locations:()=>
            g(p + '/' + tripObj.Id + '/history/locations')
        }

      permission:()=>
        g(p + '/' + tripObj.Id + '/permission')

      permissions:()=>
        @permissions(p,tripObj.Id)

      tags:()=>
        @tags(p,tripObj.Id)

    }

  mojio:(mojioObj)=>
    g=@getPath
    p='/v2/mojios'

    {
      put:()=>
        @put(p + '/'  + mojioObj.Id,grpObj)

      post:()=>
        @post(p,mojioObj)

      delete:()=>
        @delete(p + '/'  + mojioObj.Id)

      permission:()=>
        g(p + '/' + mojioObj.Id + '/permission')

      permissions:()=>
        @permissions(p,mojioObj.Id)

      tags:()=>
        @tags(p,mojioObj.Id)

    }