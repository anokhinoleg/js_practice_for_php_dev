'use strict';

import $ from 'jquery';
import 'bootstrap-sass';
import '../css/main.scss';
import 'babel-polyfill';

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

