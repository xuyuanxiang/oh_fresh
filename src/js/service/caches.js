(function (app) {
    app.factory('productCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('ohFresh.product');
    }]);
})(OhFresh);