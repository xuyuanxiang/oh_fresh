;
(function (angular, app, undefined) {
    app.factory('orderCache', [
        '$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('orderCache');
        }
    ]).factory('orderService', [
        '$http', '$q', 'orderCache',
        function ($http, $q, orderCache) {
            var getByConditions = function (conditions) {
                var deferred = $q.defer();
                var orders = orderCache.get('orders');
                if (orders) {
                    deferred.resolve(orders);
                } else {
                    var url = [
                        app.URL.orderQueryUrl,
                        "&customerId=",
                        conditions.customerId ? conditions.customerId : '',
                        "&mobilephone=",
                        conditions.mobilephone ? conditions.mobilephone : ''
                    ];
                    $http.jsonp(url.join('')).success(function (data) {
                        orderCache.put('orders', data);
                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject('系统链接失败！请稍后重试。。。');
                    });
                }
                return deferred.promise;
            };

            return {
                getByConditions: getByConditions
            }
        }
    ]);
})(angular, OhFresh, undefined);