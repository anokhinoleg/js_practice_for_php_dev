const $ = require('jquery');
const RepLogApp = require('./Components/RepLogApp');
$(document).ready(function() {
    let $wrapper = $('.js-rep-log-table');
    let repLogApp = new RepLogApp($wrapper);
});