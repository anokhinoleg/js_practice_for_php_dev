'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function (window, $, Routing, swal) {
    var HelperInstance = new WeakMap();

    var RepLogApp = function () {
        function RepLogApp($wrapper) {
            _classCallCheck(this, RepLogApp);

            this.$wrapper = $wrapper;
            this.repLogs = [];
            HelperInstance.set(this, new Helper(this.repLogs));
            this.loadRepLogs();
            this.$wrapper.on('click', '.js-delete-rep-log', this.handleRepLogDelete.bind(this));
            this.$wrapper.on('click', 'tbody tr', this.handleRowClick.bind(this));
            this.$wrapper.on('submit', RepLogApp._selectors.newRepForm, this.handleNewFormSubmit.bind(this));
        }

        _createClass(RepLogApp, [{
            key: 'loadRepLogs',
            value: function loadRepLogs() {
                var _this = this;

                $.ajax({
                    url: Routing.generate('rep_log_list')
                }).then(function (data) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = data.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var repLog = _step.value;

                            _this._addRow(repLog);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                });
            }
        }, {
            key: '_saveRepLog',
            value: function _saveRepLog(data) {
                return new Promise(function (resolve, reject) {
                    var url = Routing.generate('rep_log_new');
                    $.ajax({
                        url: url,
                        method: 'POST',
                        data: JSON.stringify(data)
                    }).then(function (data, textStatus, jqXHR) {
                        $.ajax({
                            url: jqXHR.getResponseHeader('Location')
                        }).then(function (data) {
                            resolve(data);
                        });
                    }).catch(function (jqXHR) {
                        var errorData = JSON.parse(jqXHR.responseText);
                        reject(errorData);
                    });
                });
            }
        }, {
            key: '_addRow',
            value: function _addRow(repLog) {
                this.repLogs.push(repLog);
                /*Destructuring*/
                /*let {id, itemLabel, reps} = repLog;
                console.log(id, itemLabel, reps);*/
                var html = rowTemplate(repLog);
                var $row = $($.parseHTML(html));
                $row.data('key', this.repLogs.length - 1);
                this.$wrapper.find('tbody').append($row);
                this.updateTotalWeightLifted();
            }
        }, {
            key: '_deleteRepLog',
            value: function _deleteRepLog($link) {
                var _this2 = this;

                $link.addClass('text-danger');
                $link.find('.fa').removeClass('fa-trash').addClass('fa-spinner').addClass('fa-spin');
                var deleteUrl = $link.data('url');
                var $row = $link.closest('tr');
                return $.ajax({
                    url: deleteUrl,
                    method: 'DELETE'
                }).then(function () {
                    $row.fadeOut('normal', function () {
                        _this2.repLogs.splice($row.data('key'), 1);
                        $row.remove();
                        _this2.updateTotalWeightLifted();
                    });
                });
            }
        }, {
            key: 'updateTotalWeightLifted',
            value: function updateTotalWeightLifted() {
                this.$wrapper.find('.js-total-weight').html(HelperInstance.get(this).getTotalWeightString());
            }
        }, {
            key: 'handleRepLogDelete',
            value: function handleRepLogDelete(e) {
                var _this3 = this;

                e.preventDefault();
                var $link = $(e.currentTarget);
                swal({
                    title: 'Are you sure?',
                    text: 'You will not be able to recover this imaginary file!',
                    type: 'warning',
                    showCancelButton: true,
                    showLoaderOnConfirm: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'No, keep it',
                    preConfirm: function preConfirm() {
                        return _this3._deleteRepLog($link);
                    }
                }).catch(function (arg) {
                    console.log('cancel');
                });
            }
        }, {
            key: 'handleRowClick',
            value: function handleRowClick() {
                console.log('row clicked!');
            }
        }, {
            key: 'handleNewFormSubmit',
            value: function handleNewFormSubmit(e) {
                var _this4 = this;

                e.preventDefault();
                var $form = $(e.currentTarget);
                var formData = {};
                console.log($form, $form.serializeArray());
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = $form.serializeArray()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var fieldData = _step2.value;

                        formData[fieldData.name] = fieldData.value;
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                this._saveRepLog(formData).then(function (data) {
                    _this4._clearForm();
                    _this4._addRow(data);
                }).catch(function (errorData) {
                    _this4._mapErrorsToForm(errorData.errors);
                });
            }
        }, {
            key: '_clearForm',
            value: function _clearForm() {
                this._removeFormErrors();
                var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
                $form[0].reset();
            }
        }, {
            key: '_removeFormErrors',
            value: function _removeFormErrors() {
                var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
                $form.find('.js-field-error').remove();
                $form.find('.form-group').removeClass('has-error');
            }
        }, {
            key: '_mapErrorsToForm',
            value: function _mapErrorsToForm(errorData) {
                // reset things!
                var $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
                this._removeFormErrors();
                $form.find(':input').each(function (index, element) {
                    var fieldName = $(element).attr('name');
                    var $wrapper = $(element).closest('.form-group');
                    if (!errorData[fieldName]) {
                        // no error!
                        return;
                    }
                    var $error = $('<span class="js-field-error help-block"></span>');
                    $error.html(errorData[fieldName]);
                    $wrapper.append($error);
                    $wrapper.addClass('has-error');
                });
            }
        }], [{
            key: '_selectors',
            get: function get() {
                return {
                    newRepForm: '.js-new-rep-log-form'
                };
            }
        }]);

        return RepLogApp;
    }();

    var Helper = function () {
        function Helper(repLogs) {
            _classCallCheck(this, Helper);

            this.repLogs = repLogs;
        }

        _createClass(Helper, [{
            key: 'calculateTotalWeight',
            value: function calculateTotalWeight() {
                return Helper._calculateTotalWeight(this.repLogs);
            }
        }, {
            key: 'getTotalWeightString',
            value: function getTotalWeightString() {
                var maxWeight = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;

                var weight = this.calculateTotalWeight();
                return maxWeight < weight ? maxWeight + '+' + " lbs" : weight + " lbs";
            }
        }], [{
            key: '_calculateTotalWeight',
            value: function _calculateTotalWeight(repLogs) {
                var totalWeight = 0;
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = repLogs[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var repLog = _step3.value;

                        totalWeight += repLog.totalWeightLifted;
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return totalWeight;
            }
        }]);

        return Helper;
    }();

    var rowTemplate = function rowTemplate(repLog) {
        return '\n            <tr data-weight="' + repLog.totalWeightLifted + '">\n                <td>' + repLog.itemLabel + '</td>\n                <td>' + repLog.reps + '</td>\n                <td>' + repLog.totalWeightLifted + '</td>\n                <td>\n                    <a href="#"\n                       class="js-delete-rep-log"\n                       data-url="' + repLog.links._self + '"\n                    >\n                        <span class="fa fa-trash"></span>\n                    </a>\n                </td>\n            </tr>\n        ';
    };
    window.RepLogApp = RepLogApp;
})(window, jQuery, Routing, swal);
