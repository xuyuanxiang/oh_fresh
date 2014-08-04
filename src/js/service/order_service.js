(function (angular, app, Settings) {
    app.factory('orderService', [
        '$http', '$q', 'orderCache',
        function ($http, $q, orderCache) {
            var getByConditions = function (conditions) {
                var deferred = $q.defer();
                var orders = orderCache.get('orders');
                if (orders) {
                    deferred.resolve(orders);
                } else {
                    var url = Settings.orderQueryUrl;
//                var url = Settings.orderQueryUrl + "&status=" + $scope.status;
                    url += "&customerId=" + (conditions.customerId ? conditions.customerId : '');
                    url += "&mobilephone=" + (conditions.mobilephone ? conditions.mobilephone : '');
                    $http.jsonp(url).success(function (data) {
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
})(angular, OhFresh, Settings);