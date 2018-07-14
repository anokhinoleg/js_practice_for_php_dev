import $ from 'jquery';
import 'bootstrap-sass';
import RepLogApp from './Components/RepLogApp';

global.$ = $;

$(document).ready(function() {
    let $wrapper = $('.js-rep-log-table');
    let repLogApp = new RepLogApp($wrapper, $wrapper.data('rep-logs'));
});