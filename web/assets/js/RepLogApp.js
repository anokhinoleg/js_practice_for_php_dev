(function (window, $) {
    'use strict';
    window.RepLogApp = {
        initialize: function ($wrapper) {
            this.whatIsThis('Hello');
            this.$wrapper = $wrapper;
            Helper.initialize(this.$wrapper);
            this.$wrapper.find('.js-delete-rep-log').on(
                'click',
                this.handleRepLogDelete.bind(this)
            );
            this.$wrapper.find('tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
            );
            let newThis = {
                cat: 'meow',
                dog: 'woof'
            };
        },

        updateTotalWeightLifted: function() {

            this.$wrapper.find('.js-total-weight').html(
                Helper.calculateTotalWeight()
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

        whatIsThis: function (greeting) {
            console.log(this, greeting);
        },

        handleRowClick: function () {
            console.log('row clicked!');
        }
    };

    /**
     *
     * A private object
     */
    let Helper = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;

        },
        calculateTotalWeight: function () {
            let totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function() {
                totalWeight += $(this).data('weight');
            });
            return totalWeight;
        }
    };
})(window, jQuery);
