(function (angular, Settings, app) {
    // 国家，省份，州市，区县查询， 以及级联下拉列表操作处理函数
    app.factory('locationService', ['$rootScope', '$http', '$q', 'locationCache',
        function ($rootScope, $http, $q, locationCache) {
            return function () {
                var deferred = $q.defer();
                var locations = locationCache.get('locations');
                if (locations) {
                    deferred.resolve(locations);
                } else {
                    $http.jsonp(Settings.locationUrl).success(function (data) {
                        console.log(data);
                        var countries = angular.fromJson(data) || [];
                        var provinces = countries && countries.length > 0 ? countries[0].children : [];
                        var cities = provinces && provinces.length > 0 ? provinces[0].children : [];
                        var counties = cities && cities.length > 0 ? cities[0].children : []
                        var rtn = {
                            countries: countries,
                            provinces: provinces,
                            cities: cities,
                            counties: counties
                        };
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
})(angular, Settings, OhFresh);