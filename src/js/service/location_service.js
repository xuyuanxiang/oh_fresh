;
(function (angular, app, undefined) {
    // 国家，省份，州市，区县查询， 以及级联下拉列表操作处理函数
    app.factory('locationCache', [
        '$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('locationCache');
        }
    ]).factory('locationService', [
        '$rootScope',
        '$http',
        '$q',
        'locationCache',
        function ($rootScope, $http, $q, locationCache) {

            return function () {
                var deferred = $q.defer();
                var locations = locationCache.get('locations');
                if (locations) {
                    deferred.resolve(locations);
                } else {
                    $http.jsonp(app.URL.locationUrl).success(function (data) {
                        var rtn = angular.fromJson(data);
                        locationCache.put('locations', rtn);
                        deferred.resolve(rtn);
                    }).error(function () {
                        deferred.reject('系统连接失败！请稍后重试。。。');
                    });
                }
                return deferred.promise;
            };

        }
    ]);
})(angular, OhFresh, undefined);