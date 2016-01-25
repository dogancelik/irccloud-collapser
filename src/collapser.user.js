import UI from './ui';
import Settings from './settings';

const idPrefix = 'collapser';
const userSettings = new Settings('collapser.');
const dataToggle = 'data-toggle';

var buffers; // All networks
var colEnabled, colTogActive, colTogInactive, colTogConvo, colTogArchive;
var toggleApply = false;

function hide () {
  var header =  $(this);
  var restore = header.data('restore');

  if (restore == null || toggleApply == true) {
    toggleApply = false;
    restore = header.nextAll();

    var classes = [colTogActive, colTogInactive, colTogConvo, colTogArchive]
      .filter(i => i.prop('checked'))
      .map(i => i.attr(dataToggle))
      .join(', ');

    restore = restore.filter(classes);
    header.data('restore', restore);
  }

  restore.filter('.archiveToggle').toggleClass('show');
  restore.not('.archiveToggle').toggleClass('hide');
}

function toggleActivation (toggle) {
  buffers[toggle == true ? 'on' : 'off']('dblclick', hide);
}

UI.pageReady(function () {

  var style = '$includeStyle$';
  style = UI.embedStyle(style);

  const hashName = 'collapser';
  var menu = UI.buildMenuTemplate('collapser-menu', hashName, 'Collapser');
  menu = $(menu);
  menu = UI.addMenu(menu);

  var container = '$includeContainer$';
  container = $(container);
  container = UI.addContainer(container);

  window.location.hash === '#?/settings=' + hashName && SESSIONVIEW.showSettings(hashName);
  buffers = $('h2.buffer');

  // Init container props
  const snEnabled = 'enabled';
  colEnabled = container.find(`#${idPrefix}-enabled-check`);
  colEnabled
    .change(() => { userSettings.set(snEnabled, colEnabled[0].checked); toggleActivation(colEnabled[0].checked); })
    .prop('checked', JSON.parse(userSettings.get(snEnabled, true)));


  function blink1 (next) { buffers.css({ outline: '4px solid blue' }); next(); }
  function blink2 (next) { buffers.css({ outline: '' }); next(); }
  var colShowNetworks = container.find(`#${idPrefix}-show-networks`)
    .click(() => { buffers.clearQueue(); for (var i = 0; i < 2; i++) buffers.queue(blink1).delay(600).queue(blink2).delay(600); });

  const snActive = 'toggle.active';
  colTogActive = container.find(`#${idPrefix}-collapse-active`);
  colTogActive
    .attr(dataToggle, '.channels')
    .change(() => { userSettings.set(snActive, colTogActive[0].checked); toggleApply = true; })
    .prop('checked', JSON.parse(userSettings.get(snActive, true)));

  const snInactive = 'toggle.inactive';
  colTogInactive = container.find(`#${idPrefix}-collapse-inactive`);
  colTogInactive
    .attr(dataToggle, '.inactiveChannels')
    .change(() => { userSettings.set(snInactive, colTogInactive[0].checked); toggleApply = true; })
    .prop('checked', JSON.parse(userSettings.get(snInactive, true)));

  const snConvo = 'toggle.convo';
  colTogConvo = container.find(`#${idPrefix}-collapse-convo`);
  colTogConvo
    .attr(dataToggle, '.conversations')
    .change(() => { userSettings.set(snConvo, colTogConvo[0].checked); toggleApply = true; })
    .prop('checked', JSON.parse(userSettings.get(snConvo, true)));

  const snArchive = 'toggle.archive';
  colTogArchive = container.find(`#${idPrefix}-collapse-archive`);
  colTogArchive
    .attr(dataToggle, '.archiveToggle')
    .change(() => { userSettings.set(snArchive, colTogArchive[0].checked); toggleApply = true; })
    .prop('checked', JSON.parse(userSettings.get(snArchive, true)));

  // Start
  JSON.parse(userSettings.get('enabled', true)) && toggleActivation(true);
});
