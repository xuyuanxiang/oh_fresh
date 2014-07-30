(function (angular, Settings, app) {
    // 国家，省份，州市，区县查询， 以及级联下拉列表操作处理函数
    app.factory('locationService', ['$rootScope', '$http', '$q',
        function ($rootScope, $http, $q) {
            return function () {
                var deferred = $q.defer();
                $http.jsonp(Settings.locationUrl).success(function (data) {
                    $rootScope.countries = angular.fromJson(data) || [];
                    $rootScope.provinces = $rootScope.countries.length > 0 ? $rootScope.countries[0].children : [];
                    $rootScope.cities = $rootScope.provinces.length > 0 ? $rootScope.provinces[0].children : [];
                    $rootScope.counties = $rootScope.cities.length > 0 ? $rootScope.cities[0].children : [];
                    $rootScope.countryChange = function (country) {
                        $rootScope.provinces = country.children || [];
                        $rootScope.cities = $rootScope.provinces.length > 0 ? $rootScope.provinces[0].children : [];
                        $rootScope.counties = $rootScope.cities.length > 0 ? $rootScope.cities[0].children : [];
                    };
                    $rootScope.provinceChange = function (province) {
                        $rootScope.cities = province.children || [];
                        $rootScope.counties = $rootScope.cities.length > 0 ? $rootScope.cities[0].children : [];
                    };
                    $rootScope.cityChange = function (city) {
                        $rootScope.counties = city.children || [];
                    };
                    deferred.resolve(data);
                });
                return deferred.promise;
            };

        }
    ]);
})(angular, Settings, OhFresh);