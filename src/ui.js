export default {
  pageReady (callback, interval) {
    if (interval == null) {
      interval = 100;
    }
    if (window.hasOwnProperty('SESSION')) {
      return window.SESSION.bind('init', function () {
        return callback();
      });
    } else {
      return setTimeout(function () {
        return UI.pageReady(callback);
      }, interval);
    }
  },

  buildMenuTemplate (divId, settingsId, anchorText) {
    return '<div id="' + divId + '" class="settingsMenu__item settingsMenu__item__' + settingsId + '"><a class="settingsMenu__link" href="#?/settings=' + settingsId + '">' + anchorText + '</a></div>';
  },

  embedStyle (html) {
    return $('<style>').prop('type', 'text/css').html(html).appendTo('head:first');
  },

  addMenu (jqObj) {
    return jqObj.insertAfter('.settingsContainer .settingsMenu .settingsMenu__item:last');
  },

  addContainer (jqObj) {
    return jqObj.insertAfter('.settingsContentsWrapper .settingsContents:last');
  }
};
