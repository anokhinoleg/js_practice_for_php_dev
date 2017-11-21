(function (window, $) {
    'use strict';
    window.RepLogApp = {
        initialize: function ($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper(this.$wrapper);
            console.log(this.helper, Object.keys(this.helper));

            console.log(Helper, Object.keys(Helper));
            console.log(this.helper.calculateTotalWeight());
            let playObject = {
                lift: 'stuff'
            };
            playObject.__proto__.cat = 'meow';
            console.log(playObject.lift, playObject.cat);
            console.log(
                'foo'.__proto__,
                [].__proto__,
                (new Date()).__proto__
            );
            let helper2 = new Helper($('.footer'));
            console.log(
                this.helper.calculateTotalWeight(),
                helper2.calculateTotalWeight()
            );
            this.$wrapper.find('.js-delete-rep-log').on(
                'click',
                this.handleRepLogDelete.bind(this)
            );
            this.$wrapper.find('tbody tr').on(
                'click',
                this.handleRowClick.bind(this)
            );
        },

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

        handleRowClick: function () {
            console.log('row clicked!');
        }
    };

    /**
     *
     * A "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };
    Helper.initialize = function ($wrapper) {
        this.$wrapper = $wrapper;
    };
    Helper.prototype.calculateTotalWeight = function () {
        let totalWeight = 0;
        this.$wrapper.find('tbody tr').each(function() {
            totalWeight += $(this).data('weight');
        });
        return totalWeight;
    }
})(window, jQuery);

