'use strict';
(function(window, $, Routing, swal) {
    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper(this.$wrapper);
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
            /*Destructuring*/
            /*let {id, itemLabel, reps} = repLog;
            console.log(id, itemLabel, reps);*/
            const tplText = $('#js-rep-log-row-template').html();
            const tpl = _.template(tplText);
            const html = tpl(repLog);
            this.$wrapper.find('tbody').append($.parseHTML(html));
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
                    $row.remove();
                    this.updateTotalWeightLifted();
                });
            });
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.getTotalWeightString()
            );
        }

        handleRepLogDelete(e) {
            e.preventDefault();
            const $link = $(e.currentTarget);
            swal({
                title: 'Are you sure?',
                text: 'You will not be able to recover this imaginary file!',
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

    class Helper {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
        }

        calculateTotalWeight() {
            return Helper._calculateTotalWeight(
                this.$wrapper.find('tbody tr')
            );
        }

        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();
            return maxWeight < weight ? maxWeight + '+' + " lbs" : weight + " lbs";
        }

        static _calculateTotalWeight($elements) {
            let totalWeight = 0;
            $elements.each((index, element) => {
                totalWeight += $(element).data('weight');
            });
            return totalWeight;
        }
    }

    window.RepLogApp = RepLogApp;

})(window, jQuery, Routing, swal);