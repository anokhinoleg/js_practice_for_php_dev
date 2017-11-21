(function (window, $) {
    'use strict';

    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper(this.$wrapper);

        this.$wrapper.find('.js-delete-rep-log').on(
            'click',
            this.handleRepLogDelete.bind(this)
        );
        this.$wrapper.find('tbody tr').on(
            'click',
            this.handleRowClick.bind(this)
        );

        this.$wrapper.find('.js-new-rep-log-form').on(
            'click',
            this.handleNewFormSubmit.bind(this)
        );
    };

    $.extend(RepLogApp.prototype, {
        updateTotalWeightLifted: function() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            );
        },

        handleRepLogDelete: function (e) {
            e.preventDefault();
            let $link = $(e.currentTarget);
            $link.addClass('text-danger');
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin');
            let deleteUrl = $link.data('url');
            let $row = $link.closest('tr');
            let self = this;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function() {
                    $row.fadeOut('normal', function () {
                        $row.remove();
                        self.updateTotalWeightLifted();
                    });
                }
            });
        },

        handleNewFormSubmit: function (e) {
            e.preventDefault();
            let $form = $(e.currentTarget);
            $.ajax({
                url: $form.attr('action'),
                method: 'POST',
                data: $form.serialize()
            });
            console.log('submitted!');
        },

        handleRowClick: function () {
            console.log('row clicked!');
        }
    });

    /**
     *
     * A "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            let totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function() {
                totalWeight += $(this).data('weight');
            });
            return totalWeight;
        }
    });
})(window, jQuery);

