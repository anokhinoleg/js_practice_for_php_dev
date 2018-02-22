'use strict';
const Helper = require('./RepLogAppHelper');
const $ = require('jquery');

(function(window, Routing, swal) {
    let HelperInstance = new WeakMap();
    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.repLogs = [];
            HelperInstance.set(this, new Helper(this.repLogs));
            this.loadRepLogs();
            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            );
            this.$wrapper.on(
                'click',
                'tbody tr',
                this.handleRowClick.bind(this)
            );
            this.$wrapper.on(
                'submit',
                RepLogApp._selectors.newRepForm,
                this.handleNewFormSubmit.bind(this)
            );
        }

        static get _selectors() {
            return {
                newRepForm: '.js-new-rep-log-form'
            };
        }

        loadRepLogs() {
            $.ajax({
                url: Routing.generate('rep_log_list')
            }).then((data) => {
                for (let repLog of data.items) {
                    this._addRow(repLog);
                }
            });
        }

        _saveRepLog(data) {
            return new Promise((resolve, reject) => {
                const url = Routing.generate('rep_log_new');
                $.ajax({
                    url,
                    method: 'POST',
                    data: JSON.stringify(data)
                }).then((data, textStatus, jqXHR) => {
                    $.ajax({
                        url: jqXHR.getResponseHeader('Location')
                    }).then((data) => {
                        resolve(data)
                    });
                }).catch((jqXHR) => {
                    const errorData = JSON.parse(jqXHR.responseText);
                    reject(errorData);
                });
            });
        }

        _addRow(repLog) {
            this.repLogs.push(repLog);
            /*Destructuring*/
            /*let {id, itemLabel, reps} = repLog;
            console.log(id, itemLabel, reps);*/
            const html = rowTemplate(repLog);
            const $row = $($.parseHTML(html));
            $row.data('key', this.repLogs.length - 1);
            this.$wrapper.find('tbody').append($row);
            this.updateTotalWeightLifted();
        }

        _deleteRepLog($link) {
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');
            const deleteUrl = $link.data('url');
            const $row = $link.closest('tr');
            return $.ajax({
                url: deleteUrl,
                method: 'DELETE'
            }).then(() => {
                $row.fadeOut('normal', () => {
                    this.repLogs.splice(
                        $row.data('key'),
                        1
                    );
                    $row.remove();
                    this.updateTotalWeightLifted();
                });
            });
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                HelperInstance.get(this).getTotalWeightString()
            );
        }

        handleRepLogDelete(e) {
            e.preventDefault();
            const $link = $(e.currentTarget);
            swal({
                title: 'Delete this log?',
                text: 'You will not be able to recover this log!',
                type: 'warning',
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
                preConfirm: () => {
                    return this._deleteRepLog($link);
                }
            }).catch((arg) => {
                console.log('cancel');
            });
        }

        handleRowClick() {
            console.log('row clicked!');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();
            const $form = $(e.currentTarget);
            const formData = {};
            console.log($form, $form.serializeArray());
            for (let fieldData of $form.serializeArray()){
                formData[fieldData.name] = fieldData.value;
            }
            this._saveRepLog(formData)
            .then((data) => {
                this._clearForm();
                this._addRow(data);
            }).catch((errorData) => {
                this._mapErrorsToForm(errorData.errors);
            });
        }

        _clearForm() {
            this._removeFormErrors();
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form[0].reset();
        }

        _removeFormErrors() {
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form.find('.js-field-error').remove();
            $form.find('.form-group').removeClass('has-error');
        }

        _mapErrorsToForm(errorData) {
            // reset things!
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            this._removeFormErrors();
            $form.find(':input').each((index, element) => {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if (!errorData[fieldName]) {
                    // no error!
                    return;
                }
                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error);
                $wrapper.addClass('has-error');
            });
        }
    }


    const rowTemplate = (repLog) => `
            <tr data-weight="${repLog.totalWeightLifted}">
                <td>${repLog.itemLabel}</td>
                <td>${repLog.reps}</td>
                <td>${repLog.totalWeightLifted}</td>
                <td>
                    <a href="#"
                       class="js-delete-rep-log"
                       data-url="${repLog.links._self}"
                    >
                        <span class="fa fa-trash"></span>
                    </a>
                </td>
            </tr>
        `;
    window.RepLogApp = RepLogApp;

})(window, Routing, swal);