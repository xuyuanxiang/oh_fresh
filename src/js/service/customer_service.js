(function (angular, app, Settings) {
    app.factory('customerService', [
        '$http', '$q', 'customerCache',
        function ($http, $q, customerCache) {
            var save = function (customer) {
                var deferred = $q.defer();
                var url = Settings.registerUrl;
                url += "&name=" + customer.name;
                url += "&mobilephone=" + customer.mobilephone;
                url += "&password=" + customer.password;
                url += "&email=" + (customer.email ? customer.email : '');
                url += "&wechatcode=" + (customer.wechatcode ? customer.wechatcode : '');
                url += "&countryId=" + (customer.country ? customer.country.id : '');
                url += "&provinceId=" + (customer.province ? customer.province.id : '');
                url += "&cityId=" + (customer.city ? customer.city.id : '');
                url += "&countyId=" + (customer.county ? customer.county.id : '');
                url += "&homeaddress=" + (customer.country ? customer.country.name : '')
                    + (customer.province ? customer.province.name : '')
                    + (customer.city ? customer.city.name : '')
                    + (customer.county ? customer.county.name : '')
                    + (customer.homeaddress ? customer.homeaddress : '');
                $http.jsonp(url).success(function (data) {
                    if (data) {
                        if (data.result == 1) {
                            deferred.resolve(data);
                        } else {
                            deferred.reject(data.message);
                        }
                    } else {
                        deferred.reject('系统连接失败，请稍后再试！');
                    }
                }).error(function () {
                    deferred.reject('系统连接失败，请稍后再试！');
                });
                return deferred.promise;
            };

            var getByConditions = function (conditions) {
                var deferred = $q.defer();
                if (conditions) {
                    var url = Settings.customerQuery;
                    url += "&id=" + (conditions.id ? conditions.id : '');
                    url += "&mobilephone=" + (conditions.mobilephone ? conditions.mobilephone : '');
                    url += "&password=" + (conditions.password ? conditions.password : '');
                    url += "&email=" + (conditions.email ? conditions.email : '');
                    url += "&wechatcode=" + (conditions.wechatcode ? conditions.wechatcode : '');
                    $http.jsonp(url).success(function (data) {
                        if (data) {
                            customerCache.put('customer', data);
                            deferred.resolve(data);
                        } else {
                            deferred.reject('系统连接失败，请稍后再试！');
                        }
                    }).error(function () {
                        deferred.reject('系统连接失败，请稍后再试！');
                    });

                }
                return deferred.promise;
            };

            return {
                save: save,
                getByConditions: getByConditions
            }
        }
    ]);
})(angular, OhFresh, Settings);