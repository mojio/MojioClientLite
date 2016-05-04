###
#  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
#  Licensed under the New BSD License.
#  https://github.com/stackp/promisejs
###

((exports) ->

  Promise = ->
    @_callbacks = []
    return

  join = (promises) ->
    p = new Promise
    results = []

    notifier = (i) ->
      ->
        numdone += 1
        results[i] = Array::slice.call(arguments)
        if numdone == total
          p.done results
        return

    if !promises or !promises.length
      p.done results
      return p
    numdone = 0
    total = promises.length
    i = 0
    while i < total
      promises[i].then notifier(i)
      i++
    p

  chain = (funcs, args) ->
    p = new Promise
    if funcs.length == 0
      p.done.apply p, args
    else
      funcs[0].apply(null, args).then ->
        funcs.splice 0, 1
        chain(funcs, arguments).then ->
          p.done.apply p, arguments
          return
        return
    p

  ###
  # AJAX requests
  ###

  _encode = (data) ->
    payload = ''
    if typeof data == 'string'
      payload = data
    else
      e = encodeURIComponent
      params = []
      for k of data
        if data.hasOwnProperty(k)
          params.push e(k) + '=' + e(data[k])
      payload = params.join('&')
    payload

  new_xhr = ->
    xhr = undefined
    if window.XMLHttpRequest
      xhr = new XMLHttpRequest
    else if window.ActiveXObject
      try
        xhr = new ActiveXObject('Msxml2.XMLHTTP')
      catch e
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    xhr

  ajax = (method, url, data, headers) ->
    p = new Promise
    xhr = undefined
    payload = undefined

    onTimeout = ->
      xhr.abort()
      p.done promise.ETIMEOUT, '', xhr
      return

    data = data or {}
    headers = headers or {}
    try
      xhr = new_xhr()
    catch e
      p.done promise.ENOXHR, ''
      return p
    payload = _encode(data)
    if method == 'GET' and payload
      url += '?' + payload
      payload = null
    xhr.open method, url

    content_type = 'application/x-www-form-urlencoded'
    for h of headers
      if headers.hasOwnProperty(h)
        if h.toLowerCase() == 'content-type'
          content_type = headers[h]
        else
          xhr.setRequestHeader h, headers[h]
    xhr.setRequestHeader 'Content-type', content_type

    if content_type == 'application/json'
      payload = JSON.stringify(data)
    else if content_type == 'multipart/form-data'
      payload=data

    timeout = promise.ajaxTimeout
    if timeout
      tid = setTimeout(onTimeout, timeout)

    xhr.onreadystatechange = ->
      if timeout
        clearTimeout tid
      if xhr.readyState == 4
        err = !xhr.status or (xhr.status < 200 or xhr.status >= 300) and xhr.status != 304
        p.done err, xhr.responseText, xhr
      return

    xhr.send payload
    p

  _ajaxer = (method) ->
    (url, data, headers) ->
      ajax method, url, data, headers

  Promise::then = (func, context) ->
    p = undefined
    if @_isdone
      p = func.apply(context, @result)
    else
      p = new Promise
      @_callbacks.push ->
        res = func.apply(context, arguments)
        if res and typeof res.then == 'function'
          res.then p.done, p
        return
    p

  Promise::done = ->
    @result = arguments
    @_isdone = true
    i = 0
    while i < @_callbacks.length
      @_callbacks[i].apply null, arguments
      i++
    @_callbacks = []
    return

  promise =
    Promise: Promise
    join: join
    chain: chain
    ajax: ajax
    get: _ajaxer('GET')
    post: _ajaxer('POST')
    put: _ajaxer('PUT')
    del: _ajaxer('DELETE')
    ENOXHR: 1
    ETIMEOUT: 2
    ajaxTimeout: 0
  if typeof define == 'function' and define.amd

    ### AMD support ###

    define ->
      promise
  else
    exports.promise = promise
  return
) this
