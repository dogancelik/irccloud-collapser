class Settings
  constructor: (@keyPrefix) ->

  get: (key, def) ->
    getVal = localStorage.getItem(@keyPrefix + key)
    if typeof def != 'undefined' and getVal == null
      @set key, def
      return def
    getVal

  set: (key, value) ->
    localStorage.setItem @keyPrefix + key, value

  remove: (keys) ->
    keys = [].concat(keys)
    keys.forEach (key) => localStorage.removeItem @keyPrefix + key
