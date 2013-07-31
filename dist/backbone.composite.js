/**
 * Backbone.Composite v0.1.0
 * https://github.com/DreamTheater/Backbone.Composite
 *
 * Copyright (c) 2013 Dmytro Nemoga
 * Released under the MIT license
 */
(function (self) {
    'use strict';

    var Composite = Backbone.Composite = function (view) {

        ////////////////////

        if (!(this instanceof Composite)) {
            return new Composite(view);
        }

        ////////////////////

        self = _.extend(this, {
            view: view
        }, {
            components: {}
        });

        ////////////////////

        _.extend(view, {
            render: _.wrap(view.render, function (fn) {
                fn.call(this);

                self.renderComponents();

                return this;
            }),

            remove: _.wrap(view.remove, function (fn) {
                self.removeComponents();

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

                var view = options.view;

                ////////////////////

                this.components[component] = options;

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

            _.each(components, function (options) {

                ////////////////////

                var view = options.view,

                    $el = this._resolveElement.call({
                        view: this.view,
                        options: options
                    });

                ////////////////////

                view.setElement($el).render();
            }, this);

            return this;
        },

        removeComponents: function () {
            var components = this.components;

            _.each(components, function (options) {

                ////////////////////

                var view = options.view;

                ////////////////////

                view.remove();
            });

            return this;
        },

        _resolveElement: function () {

            ////////////////////

            var selector = this.options.selector;

            ////////////////////

            var view = this.view;

            if (_.isFunction(selector)) {
                selector = selector.call(view);
            }

            return selector ? view.$(selector) : view.$el;
        }
    });
}());
