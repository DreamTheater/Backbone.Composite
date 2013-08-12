(function () {
    'use strict';

    ////////////////////

    var scope;

    ////////////////////

    var Composite = Backbone.Composite = function (view) {

        ////////////////////

        if (!(this instanceof Composite)) {
            return new Composite(view);
        }

        ////////////////////

        scope = _.extend(this, {
            view: view
        }, {
            components: {}
        });

        ////////////////////

        _.extend(view, {
            render: _.wrap(view.render, function (fn) {
                fn.call(this);

                scope.renderComponents();

                return this;
            }),

            remove: _.wrap(view.remove, function (fn) {
                scope.removeComponents();

                fn.call(this);

                return this;
            })
        });
    };

    _.extend(Composite.prototype, {
        constructor: Composite,

        add: function (component, options) {

            ////////////////////

            var components;

            if (!component || _.isObject(component)) {
                components = component;
            } else {
                (components = {})[component] = options;
            }

            ////////////////////

            _.each(components, function (options, component) {

                ////////////////////

                var view = options.view, selector = options.selector;

                ////////////////////

                this.components[component] = _.extend(view, {
                    selector: selector || null
                });

                this.view.listenTo(view, 'all', function (event) {

                    ////////////////////

                    var args = Array.prototype.slice.call(arguments, 1);

                    args.unshift(event, view);

                    ////////////////////

                    this.trigger.apply(this, args);
                });
            }, this);

            this.refresh();

            return this;
        },

        refresh: function () {
            this.view.render();

            return this;
        },

        renderComponents: function () {
            var components = this.components;

            _.each(components, function (view) {
                var $el = this._resolveElement.call({
                    view: this.view,
                    selector: view.selector
                });

                view.setElement($el).render();
            }, this);

            return this;
        },

        removeComponents: function () {
            var components = this.components;

            _.each(components, function (view) {
                view.remove();
            });

            return this;
        },

        _resolveElement: function () {
            var view = this.view, selector = this.selector;

            if (_.isFunction(selector)) {
                selector = selector.call(view);
            }

            return selector ? view.$(selector) : view.$el;
        }
    });
}());
