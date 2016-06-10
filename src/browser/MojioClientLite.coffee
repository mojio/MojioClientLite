$http = (url) ->
  _encode = (data) ->
    payload = ''
    if typeof data == 'string'
      payload = data
    else
      params = []
      for k of data
        if data.hasOwnProperty(k)
          params.push e(k) + '=' + encodeURIComponent(data[k])
      payload = params.join('&')
    payload

  core = ajax: (method, url, data, headers) ->

    new Promise((resolve, reject) ->

      client = new XMLHttpRequest

      data = data or {}
      headers = headers or {}
      payload = _encode(data)

      if method == 'GET' and payload
        url += '?' + payload
        payload = null

      client.open method, url

      content_type = 'application/x-www-form-urlencoded'
      for h of headers
        if headers.hasOwnProperty(h)
          if h.toLowerCase() == 'content-type'
            content_type = headers[h]
          else
            client.setRequestHeader h, headers[h]
      client.setRequestHeader 'Content-type', content_type

      if content_type == 'application/json'
        payload = JSON.stringify(data)
      else if content_type == 'multipart/form-data'
        payload=data

      client.send(payload)

      client.onload = ->
        if @status >= 200 and @status < 300
          resolve @response
        else
          reject @statusText
        return

      client.onerror = ->
        reject @statusText
        return

      return
    )

  {
    'get': (args,headers) ->
      core.ajax 'GET', url, args, headers
    'post': (args) ->
      core.ajax 'POST', url, args, headers
    'put': (args) ->
      core.ajax 'PUT', url, args, headers
    'delete': (args) ->
      core.ajax 'DELETE', url, args, headers
  }

class @MojioClientLite

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
      accountsURL: 'accounts.moj.io'
      apiURL: 'api.moj.io'
      pushURL: 'push.moj.io'
      wsURL: 'api.moj.io'
      redirect_uri:window.location.href.replace('http:','https:').split('#')[0],
      scope:'admin'
      acceptLanguage:'en'
      tokenRequester:()->
        document.location.hash.match(/access_token=([0-9a-f-]{36})/)[1]
    }

    env='https://'
    wsEnv='wss://'
    @config = @constructor.extend({},defConfig,conf)
    if @config.environment!=''
      env=env + @config.environment + '-'
      wsEnv=wsEnv  + @config.environment + '-'

    @config.accountsURL=env + @config.accountsURL
    @config.apiURL=env + @config.apiURL
    @config.pushURL=env + @config.pushURL
    @config.wsURL=wsEnv + @config.wsURL

  authorize:()=>
    window.location.href @config.accountsURL + '/OAuth2/authorize' + '?response_type=token&client_id=' + @config.application + '&redirect_uri=' +  @config.redirect_uri + '&scope=' + @config.scope

  token:()=>
    param = window.location.toString().split('#')[1]
    found=false

    if typeof(param) != 'undefined' && param.indexOf('access_token=')!=-1
      try
        access_token = @config.tokenRequester()

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
    {
      'Accept': 'application/json'
      'Authorization': 'Bearer ' + @config.access_token
      'Accept-Language': @config.acceptLanguage
      'Content-Type':'application/json'
    }

  query:()=>
    class qc
      data:{}
      top:($top)=>
        @data.$top=$top
        return @
      skip:($skip)=>
        @data.$skip=$skip
        return @
      filter:($filter)=>
        @data.$filter=$filter
        return @
      select:($select)=>
        @data.$select=$select
        return @
      orderby:($orderby)=>
        @data.$orderby=$orderby
        return @

      prepare:()=>
        @data
    new qc()

  getPath:(path,data,header)=>
    data=data or {}
    if data.prepare? then data=data.prepare()

    new Promise((resolve, reject) ->
      $http(@config.apiURL + path).get(data,@constructor.extend({},@header(),header or {})).then(
        (data)-> resolve JSON.parse(data)
      ,
        (data)-> reject data
      )
    )

  get:()=>
    if arguments.length==0
      return {
        me:(data,header)=>  @getPath('/v2/me',data,header)
        users:(data,header)=>  @getPath('/v2/users',data,header)
        mojios:(data,header)=>  @getPath('/v2/mojios',data,header)
        vehicles:(data,header)=>  @getPath('/v2/vehicles',data,header)
        apps:(data,header)=>  @getPath('/v2/apps',data,header)
        groups:(data,header)=>  @getPath('/v2/groups',data,header)
        trips:(data,header)=>  @getPath('/v2/trips',data,header)
        geofences:(data,header)=>  @getPath('/v2/geofences',data,header)

        user:(id)->  @getPath('/v2/users/' + id)
        mojio:(id)=>  @getPath('/v2/mojios/'+ id)
        vehicle:(id)=>  @getPath('/v2/vehicles/'+ id)
        app:(id)=>  @getPath('/v2/apps/'+ id)
        group:(id)=>  @getPath('/v2/groups/'+ id)
        trip:(id)=>  @getPath('/v2/trips/'+ id)
        geofence:(id)=>  @getPath('/v2/geofences/' + id)
      }
    else
      @getPath(arguments[0],arguments[1] or {})

  push:()=>
    if arguments.length==0
      return {
        mojios:()=>  push('/v2/mojios')
        vehicles:()=>  push('/v2/vehicles')

        mojio:(obj)=>  push('/v2/mojios/' + obj.Id)
        vehicle:(obj)=>  push('/v2/vehicles/' + obj.Id)
      }
    else
      return new WebSocket(@config.wsURL + arguments[0],@config.access_token)


  put:(path,data)=>
    new Promise((resolve, reject) ->
      $http(@config.apiURL + path).put(data or {},@constructor.extend({},@header(),header or {})).then(
        (data)-> resolve JSON.parse(data)
      ,
        (data)-> reject data
      )
    )

  post:(path,data)=>
    new Promise((resolve, reject) ->
      $http(@config.apiURL + path).post(data or {},@constructor.extend({},@header(),header or {})).then(
        (data)-> resolve JSON.parse(data)
      ,
        (data)-> reject data
      )
    )

  delete:(path,data)=>
    new Promise((resolve, reject) ->
      $http(@config.apiURL + path).delete(data or {},@constructor.extend({},@header(),header or {})).then(
        (data)-> resolve JSON.parse(data)
      ,
        (data)-> reject data
      )
    )

  permissions:(path,oid)=>
    {
      get:()=> @getPath(path + '/' + oid + '/permissions')
      delete:()=> @delete(path + '/' + oid + '/permissions')
      put:(data)=> @put(path + '/' + oid + '/permissions',data)
      post:(data)=> @post(path + '/' + oid + '/permissions',data)
    }

  image:(path,oid)=>
    {
      get:()=> @getPath(path + '/' + oid + '/image')
      delete:()=> @delete(path + '/' + oid + '/image')
      put:(data)=> @put(path + '/' + oid + '/image',data,{'Content-Type':'multipart/form-data'})
      post:(data)=> @post(path + '/' + oid + '/image',data,{'Content-Type':'multipart/form-data'})
    }

  tags:(path,oid)=>
    {
      delete:(tag)=> @delete(path + '/' + oid + '/tags/' + tag)
      post:(tag)=> @post(path + '/' + oid + '/tags/' + tag)

    }

  app:(obj)=>
    {
      put:()=> @put('/v2/apps/'  + obj.Id,obj)
      post:()=> @post('/v2/apps',obj)
      delete:()=> @delete('/v2/apps/'  + obj.Id)
      secret:()=>
          get:()=> @getPath('/v2/apps/' + obj.Id + '/secret')
          delete:()=> @delete('/v2/apps/' + obj.Id + '/secret')
      image:()=> @image('/v2/apps',obj.Id)
      permission:()=> @getPath('/v2/apps/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/apps',obj.Id)
      tags:()=> @tags('/v2/apps',obj.Id)
    }

  vehicle:(obj)=>
    {
      put:()=> @put('/v2/vehicles/'  + obj.Id,obj)
      post:()=> @post('/v2/vehicles',obj)
      delete:()=> @delete('/v2/vehicles/'  + obj.Id)
      address:()=> @getPath('/v2/vehicles/' + obj.Id + '/address')
      trips:(data)=> @getPath('/v2/vehicles/' + obj.Id + '/trips',data)
      vin:()=> @getPath('/v2/vehicles/' + obj.Id + '/vin')
      serviceschedule:()=> @getPath('/v2/vehicles/' + obj.Id + '/serviceschedule')
      serviceschedulenext:()=> @getPath('/v2/vehicles/' + obj.Id + '/serviceschedulenext')
      history:()=>
          states:()=> @getPath('/v2/vehicles/' + obj.Id + '/history/states')
          locations:()=> @getPath('/v2/vehicles/' + obj.Id + '/history/locations')
      image:()=> @image('/v2/vehicles',obj.Id)
      permission:()=> @getPath('/v2/vehicles/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/vehicles',obj.Id)
      tags:()=> @tags('/v2/vehicles',obj.Id)
    }

  user:(obj)=>
    {
      put:()=> @put('/v2/users/'  + obj.Id,obj)
      post:()=> @post('/v2/users',obj)
      delete:()=> @delete('/v2/users/'  + obj.Id)
      vehicles:()=> @getPath('/v2/users/' + obj.Id + '/vehicles')
      mojios:()=> @getPath('/v2/users/' + obj.Id + '/mojios')
      trips:()=> @getPath('/v2/users/' + obj.Id + '/trips')
      groups:()=> @getPath('/v2/users/' + obj.Id + '/groups')
      image:()=> @image('/v2/users',obj.Id)
      permission:()=> @getPath('/v2/users/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/users',obj.Id)
      tags:()=> @tags(p,obj.Id)
    }

  geofence:(obj)=>
    {
      put:()=> @put('/v2/geofences/'  + obj.Id,obj)
      post:()=> @post('/v2/geofences',obj)
      delete:()=> @delete('/v2/geofences/' + obj.Id)
    }

  group:(obj)=>
    {
      put:()=> @put('/v2/groups/'  + obj.Id,obj)
      post:()=> @post('/v2/groups',obj)
      delete:()=> @delete('/v2/groups/'  + obj.Id)
      users:()=>
          get:()=> @getPath('/v2/groups/' + obj.Id + '/users')
          delete:()=> @delete('/v2/groups/' + obj.Id + '/users')
          put:(data)=> @put('/v2/groups/' + obj.Id + '/users',data)
          post:(data)=> @post('/v2/groups/' + obj.Id + '/users',data)
      permission:()=> @getPath('/v2/groups/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/groups',obj.Id)
      tags:()=> @tags(p,obj.Id)
    }

  trip:(obj)=>
    {
      put:()=> @put('/v2/trips/'  + obj.Id,obj)
      delete:()=> @delete('/v2/trips/'  + obj.Id)
      history:()=>
          states:()=> @getPath('/v2/trips/' + obj.Id + '/history/states')
          locations:()=> @getPath('/v2/trips/' + obj.Id + '/history/locations')
      permission:()=> @getPath('/v2/trips/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/trips',obj.Id)
      tags:()=> @tags('/v2/trips',obj.Id)
    }

  mojio:(obj)=>
    {
      put:()=> @put('/v2/mojios' + '/'  + obj.Id,obj)
      post:()=> @post('/v2/mojios',obj)
      delete:()=> @delete('/v2/mojios' + '/'  + obj.Id)
      permission:()=> @getPath('/v2/mojios' + '/' + obj.Id + '/permission')
      permissions:()=> @permissions('/v2/mojios',obj.Id)
      tags:()=> @tags('/v2/mojios',obj.Id)
    }