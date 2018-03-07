'use strict';

const $ = require('jquery');
require('bootstrap');
require('babel-polyfill');

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

