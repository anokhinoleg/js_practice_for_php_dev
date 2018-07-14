const $ = require('jquery');
require('bootstrap-sass')
const RepLogApp = require('./Components/RepLogApp');

global.$ = $;

$(document).ready(function() {
    let $wrapper = $('.js-rep-log-table');
    let repLogApp = new RepLogApp($wrapper, $wrapper.data('rep-logs'));
});