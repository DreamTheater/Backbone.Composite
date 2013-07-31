$(function () {
    'use strict';

    ///////////////////
    // PREREQUISITES //
    ///////////////////

    var View = Backbone.View.extend({
        el: '#composite-fixture',

        initialize: function () {
            var composite = this.composite = Backbone.Composite(this);

            composite.add({
                'first-component': {
                    view: new (Backbone.View.extend({
                        render: function () {
                            this.$el.text(this.cid).data('view', this);

                            this.trigger('render', 'arg1', 'arg2', 'arg3');

                            return this;
                        }
                    }))(),

                    selector: '.first-component'
                },

                'second-component': {
                    view: new (Backbone.View.extend({
                        render: function () {
                            this.$el.text(this.cid).data('view', this);

                            this.trigger('render', 'arg1', 'arg2', 'arg3');

                            return this;
                        }
                    }))(),

                    selector: '.second-component'
                }
            });
        }
    });

    ////////////
    // MODULE //
    ////////////

    module('Backbone.Composite', {
        setup: function () {
            this.view = new View();
        }
    });

    ///////////
    // TESTS //
    ///////////

    test('initialize with components', function () {
        var view = this.view, composite = view.composite,

            firstComponent = composite.components['first-component'],
            secondComponent = composite.components['second-component'],

            $firstComponent = view.$('.first-component'),
            $secondComponent = view.$('.second-component');

        strictEqual($firstComponent.data('view'), firstComponent.view);
        strictEqual($secondComponent.data('view'), secondComponent.view);
    });

    test('event bubbling', function () {
        var view = this.view, composite = view.composite,

            firstComponent = composite.components['first-component'],
            secondComponent = composite.components['second-component'];

        view.once('render', function (view, arg1, arg2, arg3) {
            strictEqual(view, firstComponent.view);

            strictEqual(arg1, 'arg1');
            strictEqual(arg2, 'arg2');
            strictEqual(arg3, 'arg3');
        });

        firstComponent.view.render();

        view.once('render', function (view, arg1, arg2, arg3) {
            strictEqual(view, secondComponent.view);

            strictEqual(arg1, 'arg1');
            strictEqual(arg2, 'arg2');
            strictEqual(arg3, 'arg3');
        });

        secondComponent.view.render();
    });
});
