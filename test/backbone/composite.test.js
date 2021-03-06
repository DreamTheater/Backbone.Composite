(function (factory) {
    'use strict';

    var isNode = typeof module === 'object' && typeof exports === 'object';

    ////////////////////

    var root = isNode ? require('../environment.js') : window;

    ////////////////////

    factory(root, isNode);

}(function (root) {
    'use strict';

    var _ = root._, Backbone = root.Backbone,

        chai = root.chai,
        sinon = root.sinon;

    ////////////////////

    var expect = chai.expect;

    ////////////////////

    describe('Backbone.Composite', function () {

        ////////////////////

        var view, composite;

        ////////////////////

        // before(function () {
        //
        // });

        // beforeEach(function () {
        //
        // });

        // afterEach(function () {
        //
        // });

        // after(function () {
        //
        // });

        ////////////////////

        describe('#constructor(view)', function () {
            it('should initialize the composite', function () {

                ////////////////////

                var View = Backbone.View.extend({
                    initialize: function () {
                        composite = Backbone.Composite(this);
                    }
                });

                ////////////////////

                view = new View({
                    el: '#composite-fixture'
                });

                expect(composite).to.be.an.instanceOf(Backbone.Composite);
            });
        });

        describe('#add(component, options)', function () {
            it('should add components to the composite', function () {

                ////////////////////

                var FirstComponent = Backbone.View.extend({
                        render: sinon.spy(),
                        remove: sinon.spy()
                    }),

                    SecondComponent = Backbone.View.extend({
                        render: sinon.spy(),
                        remove: sinon.spy()
                    });

                ////////////////////

                composite.add({
                    firstComponent: { view: new FirstComponent(), selector: '.first-component' },
                    secondComponent: { view: new SecondComponent(), selector: '.second-component' }
                });

                expect(composite.components.firstComponent).to.be.an.instanceOf(FirstComponent);
                expect(composite.components.secondComponent).to.be.an.instanceOf(SecondComponent);
            });

            it('should invoke `render()` of each component', function () {
                expect(composite.components.firstComponent.render).to.have.been.calledOnce;
                expect(composite.components.secondComponent.render).to.have.been.calledOnce;
            });
        });

        describe('#view', function () {
            it('should propagate events of all components', function () {

                ////////////////////

                var callback = sinon.spy();

                ////////////////////

                composite.view.on('event', callback);

                composite.components.firstComponent.trigger('event', 'foo');
                expect(callback).to.have.been.calledWithExactly(composite.components.firstComponent, 'foo');

                composite.components.secondComponent.trigger('event', 'bar');
                expect(callback).to.have.been.calledWithExactly(composite.components.secondComponent, 'bar');
            });
        });

        describe('#view.render()', function () {
            it('should invoke `render()` of each component', function () {
                composite.view.render();

                expect(composite.components.firstComponent.render).to.have.been.calledTwice;
                expect(composite.components.secondComponent.render).to.have.been.calledTwice;
            });
        });

        describe('#view.remove()', function () {
            it('should invoke `remove()` of each component', function () {
                composite.view.remove();

                expect(composite.components.firstComponent.remove).to.have.been.called;
                expect(composite.components.secondComponent.remove).to.have.been.called;
            });
        });
    });
}));
