// ==UserScript==// @name        Collapser// @namespace   dogancelik.com// @description Collapse servers in IRCCloud// @include     https://www.irccloud.com/*// @version     1.0.0// @grant       none// @icon        https://www.irccloud.com/favicon.ico// @updateURL   https://github.com/dogancelik/dogancelik/irccloud-collapser/raw/master/build/collapser.meta.js// @downloadURL https://github.com/dogancelik/dogancelik/irccloud-collapser/raw/master/build/collapser.user.js// @homepage    https://github.com/dogancelik/dogancelik/irccloud-collapser// @license     MIT// ==/UserScript==
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ui = require('./ui');

var _ui2 = _interopRequireDefault(_ui);

var _settings = require('./settings');

var _settings2 = _interopRequireDefault(_settings);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var idPrefix = 'collapser';
var userSettings = new _settings2.default('collapser.');
var dataToggle = 'data-toggle';

var buffers; // All networks
var colEnabled, colTogActive, colTogInactive, colTogConvo, colTogArchive;
var toggleApply = false;

function hide() {
  var header = $(this);
  var restore = header.data('restore');

  if (restore == null || toggleApply == true) {
    toggleApply = false;
    restore = header.nextAll();

    var classes = [colTogActive, colTogInactive, colTogConvo, colTogArchive].filter(function (i) {
      return i.prop('checked');
    }).map(function (i) {
      return i.attr(dataToggle);
    }).join(', ');

    restore = restore.filter(classes);
    header.data('restore', restore);
  }

  restore.filter('.archiveToggle').toggleClass('show');
  restore.not('.archiveToggle').toggleClass('hide');
}

function toggleActivation(toggle) {
  buffers[toggle == true ? 'on' : 'off']('dblclick', hide);
}

_ui2.default.pageReady(function () {

  var style = '#collapser-enabled-label{font-weight:normal}#collapser-enabled-check:not(:checked) ~ #collapser-enabled-label{color:#f00;}#collapser-enabled-check:not(:checked) ~ #collapser-enabled-label::after{content:"Not enabled"}#collapser-enabled-check:checked ~ #collapser-enabled-label{color:#008000;}#collapser-enabled-check:checked ~ #collapser-enabled-label::after{content:"Enabled"}';
  style = _ui2.default.embedStyle(style);

  var hashName = 'collapser';
  var menu = _ui2.default.buildMenuTemplate('collapser-menu', hashName, 'Collapser');
  menu = $(menu);
  menu = _ui2.default.addMenu(menu);

  var container = '<div id="collapser-container" data-section="collapser" class="settingsContents settingsContents__collapser"><h2 class="settingsTitle"><span>Collapser&nbsp;</span><input id="collapser-enabled-check" type="checkbox"/>&nbsp;<label id="collapser-enabled-label" for="collapser-enabled-check"></label></h2><p class="explanation">Double click on <a id="collapser-show-networks" href="javascript:void(0)">Networks</a> to show or hide their child items.</p><h3>Toggle options</h3><table class="checkboxForm"><tr><td><input id="collapser-collapse-active" type="checkbox"/></td><th><label for="collapser-collapse-active">&nbsp;Toggle Active Channels</label></th></tr><tr><td><input id="collapser-collapse-inactive" type="checkbox"/></td><th><label for="collapser-collapse-inactive">&nbsp;Toggle Inactive Channels</label></th></tr><tr><td><input id="collapser-collapse-convo" type="checkbox"/></td><th><label for="collapser-collapse-convo">&nbsp;Toggle Conversations</label></th></tr><tr><td><input id="collapser-collapse-archive" type="checkbox"/></td><th><label for="collapser-collapse-archive">&nbsp;Toggle Archives</label></th></tr></table><hr/><p class="explanation"><b>If you like this script, please&nbsp;<a href="https://dogancelik.com/donate.html" target="_blank">consider a donation</a></b></p><p class="explanation"><a href="https://github.com/dogancelik/irccloud-collapser" target="_blank">Source code</a>&nbsp;-&nbsp;<a href="https://github.com/dogancelik/irccloud-collapser/issues" target="_blank">Report bug / Request feature</a></p></div>';
  container = $(container);
  container = _ui2.default.addContainer(container);

  window.location.hash === '#?/settings=' + hashName && SESSIONVIEW.showSettings(hashName);
  buffers = $('h2.buffer');

  // Init container props
  var snEnabled = 'enabled';
  colEnabled = container.find('#' + idPrefix + '-enabled-check');
  colEnabled.change(function () {
    userSettings.set(snEnabled, colEnabled[0].checked);toggleActivation(colEnabled[0].checked);
  }).prop('checked', JSON.parse(userSettings.get(snEnabled, true)));

  function blink1(next) {
    buffers.css({ outline: '4px solid blue' });next();
  }
  function blink2(next) {
    buffers.css({ outline: '' });next();
  }
  var colShowNetworks = container.find('#' + idPrefix + '-show-networks').click(function () {
    buffers.clearQueue();for (var i = 0; i < 2; i++) {
      buffers.queue(blink1).delay(600).queue(blink2).delay(600);
    }
  });

  var snActive = 'toggle.active';
  colTogActive = container.find('#' + idPrefix + '-collapse-active');
  colTogActive.attr(dataToggle, '.channels').change(function () {
    userSettings.set(snActive, colTogActive[0].checked);toggleApply = true;
  }).prop('checked', JSON.parse(userSettings.get(snActive, true)));

  var snInactive = 'toggle.inactive';
  colTogInactive = container.find('#' + idPrefix + '-collapse-inactive');
  colTogInactive.attr(dataToggle, '.inactiveChannels').change(function () {
    userSettings.set(snInactive, colTogInactive[0].checked);toggleApply = true;
  }).prop('checked', JSON.parse(userSettings.get(snInactive, true)));

  var snConvo = 'toggle.convo';
  colTogConvo = container.find('#' + idPrefix + '-collapse-convo');
  colTogConvo.attr(dataToggle, '.conversations').change(function () {
    userSettings.set(snConvo, colTogConvo[0].checked);toggleApply = true;
  }).prop('checked', JSON.parse(userSettings.get(snConvo, true)));

  var snArchive = 'toggle.archive';
  colTogArchive = container.find('#' + idPrefix + '-collapse-archive');
  colTogArchive.attr(dataToggle, '.archiveToggle').change(function () {
    userSettings.set(snArchive, colTogArchive[0].checked);toggleApply = true;
  }).prop('checked', JSON.parse(userSettings.get(snArchive, true)));

  // Start
  JSON.parse(userSettings.get('enabled', true)) && toggleActivation(true);
});

},{"./settings":2,"./ui":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Settings = function () {
  function Settings(keyPrefix) {
    _classCallCheck(this, Settings);

    this.keyPrefix = keyPrefix;
  }

  _createClass(Settings, [{
    key: 'get',
    value: function get(key, def) {
      var getVal = localStorage.getItem(this.keyPrefix + key);
      if (typeof def !== 'undefined' && getVal === null) {
        this.set(key, def);
        return def;
      }
      return getVal;
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      return localStorage.setItem(this.keyPrefix + key, value);
    }
  }, {
    key: 'remove',
    value: function remove(keys) {
      var _this = this;

      keys = [].concat(keys);
      return keys.forEach(function (key) {
        return localStorage.removeItem(_this.keyPrefix + key);
      });
    }
  }]);

  return Settings;
}();

exports.default = Settings;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  pageReady: function pageReady(callback, interval) {
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
  buildMenuTemplate: function buildMenuTemplate(divId, settingsId, anchorText) {
    return '<div id="' + divId + '" class="settingsMenu__item settingsMenu__item__' + settingsId + '"><a class="settingsMenu__link" href="#?/settings=' + settingsId + '">' + anchorText + '</a></div>';
  },
  embedStyle: function embedStyle(html) {
    return $('<style>').prop('type', 'text/css').html(html).appendTo('head:first');
  },
  addMenu: function addMenu(jqObj) {
    return jqObj.insertAfter('.settingsContainer .settingsMenu .settingsMenu__item:last');
  },
  addContainer: function addContainer(jqObj) {
    return jqObj.insertAfter('.settingsContentsWrapper .settingsContents:last');
  }
};

},{}]},{},[1]);
