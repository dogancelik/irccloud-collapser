UI = {}

UI.pageReady = (callback, interval = 100) ->
  if window.hasOwnProperty 'SESSION'
    window.SESSION.bind 'init', -> callback()
  else
    setTimeout ->
      UI.pageReady(callback)
    , interval

UI.buildMenuTemplate = (divId, settingsId, anchorText) ->
  '<div id="' \
  + divId \
  + '" class="settingsMenu__item settingsMenu__item__' \
  + settingsId \
  + '"><a class="settingsMenu__link" href="#?/settings=' \
  + settingsId  \
  + '">' \
  + anchorText \
  + '</a></div>'

UI.embedStyle = (html) ->
  $('<style>').prop('type', 'text/css').html(html).appendTo('head:first')

UI.addMenu = (jqObj) ->
  jqObj.insertAfter('.settingsContainer .settingsMenu .settingsMenu__item:last')

UI.addContainer = (jqObj) ->
  jqObj.insertAfter('.settingsContentsWrapper .settingsContents:last')
