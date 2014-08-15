(function (angular, app) {
    app.factory('customerCache', [
        '$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('customerCache');
        }
    ]).factory('customerService', [
        '$http',
        '$q',
        'customerCache',
        function ($http, $q, customerCache) {

            var save = function (customer) {
                var deferred = $q.defer();
                var url = [
                    app.URL.registerUrl,
                    "&name=",
                    customer.name,
                    "&mobilephone=",
                    customer.mobilephone,
                    "&password=",
                    customer.password,
                    "&email=",
                    customer.email ? customer.email : '',
                    "&wechatcode=",
                    customer.wechatcode ? customer.wechatcode : '',
                    "&countryId=",
                    customer.country ? customer.country.id : '',
                    "&provinceId=",
                    customer.province ? customer.province.id : '',
                    "&cityId=",
                    customer.city ? customer.city.id : '',
                    "&countyId=",
                    customer.county ? customer.county.id : '',
                    "&homeaddress=",
                    customer.country ? customer.country.name : '',
                    customer.province ? customer.province.name : '',
                    customer.city ? customer.city.name : '',
                    customer.county ? customer.county.name : '',
                    customer.homeaddress ? customer.homeaddress : ''
                ];
                $http.jsonp(url.join('')).success(function (data) {
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
                    var customer = customerCache.get('customer');
                    if (customer && (conditions.mobilephone && customer.mobilephone == conditions.mobilephone) ||
                        (conditions.email && customer.email == conditions.email) ||
                        (conditions.wechatcode && customer.wechatcode == conditions.wechatcode)) {
                        customerCache.put('customer', customer);
                        deferred.resolve(customer);
                    }
                    else {
                        var url = [
                            app.URL.customerQuery,
                            "&id=",
                            conditions.id ? conditions.id : '',
                            "&mobilephone=",
                            conditions.mobilephone ? conditions.mobilephone : '',
                            "&password=",
                            conditions.password ? conditions.password : '',
                            "&email=",
                            conditions.email ? conditions.email : '',
                            "&wechatcode=",
                            conditions.wechatcode ? conditions.wechatcode : ''
                        ];
                        $http.jsonp(url.join('')).success(function (data) {
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
                }
                return deferred.promise;
            };

            return {
                save: save,
                getByConditions: getByConditions
            }
        }
    ]);
})(angular, OhFresh);