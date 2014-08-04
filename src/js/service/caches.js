(function (app) {
    app.factory('productCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('productCache');
    }]);
    app.factory('channelCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('channelCache');
    }]);
    app.factory('addressCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('addressCache');
    }]);
    app.factory('locationCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('locationCache');
    }]);
    app.factory('customerCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('customerCache');
    }]);
    app.factory('orderCache', ['$cacheFactory', function ($cacheFactory) {
        return $cacheFactory('orderCache');
    }]);
})(OhFresh);