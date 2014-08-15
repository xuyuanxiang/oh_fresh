;
(function (angular, app, undefined) {

    //用户地址的增删改查 以及 默认地址设置，与后台进行数据交互
    app.factory('addressCache', [//缓存
        '$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('addressCache');
        }
    ]).factory('addressService', [
        '$http', '$q', 'addressCache',
        function ($http, $q, addressCache) {

            //通过用户ID查找地址列表
            var getByCustomer = function (customerId) {
                var deferred = $q.defer();
//                var addresses = addressCache.get('addresses');
//                if (addresses) {
//                    deferred.resolve(addresses);
//                } else {
                    var url = [app.URL.addressQuery, "&customerId=", customerId];
                    $http.jsonp(url.join('')).success(function (data) {
                        addressCache.put('addresses', data);
                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject('系统连接失败！请稍后重试。。。');
                    });
//                }
                return deferred.promise;
            };

            // 设置用户默认收货地址
            var defaultConfig = function (customerId, addressId) {
                var deferred = $q.defer();
                var url = [app.URL.addressDefault, "&customerId=", customerId, "&addressId=", addressId];
                $http.jsonp(url.join('')).success(function (data) {
                    if (data && data.result == 1) {
                        deferred.resolve(data.message);
                    } else {
                        deferred.reject('设置失败！请稍后重试。。。');
                    }
                }).error(function () {
                    deferred.reject('系统连接失败！请稍后重试。。。');
                });
                return deferred.promise;
            };

            //创建或更新地址
            var save = function (address, customerId) {
                var deferred = $q.defer();
                var url = address.id ? [app.URL.addressUpdate] : [app.URL.addressCreate];
                if (address.id) {
                    url.push("&id=");
                    url.push(address.id);
                }
                url.push("&customerId=");
                url.push(customerId);
                url.push("&mobilephone=");
                url.push(address.mobilephone);
                url.push("&name=");
                url.push(address.name);
                url.push("&countryId=");
                url.push(address.country ? address.country.id : '');
                url.push("&provinceId=");
                url.push(address.province ? address.province.id : '');
                url.push("&cityId=");
                url.push(address.city ? address.city.id : '');
                url.push("&countyId=");
                url.push(address.county ? address.county.id : '');
                url.push("&homeaddress=");
                url.push(address.country ? address.country.name : '');
                url.push(address.province ? address.province.name : '');
                url.push(address.city ? address.city.name : '');
                url.push(address.county ? address.county.name : '');
                url.push(address.assemblename ? address.assemblename : '');
                $http.jsonp(url.join('')).success(function (data) {
                    if (data && data.result == 1) {
                        deferred.resolve(data);
                        addressCache.remove('addresses');
                    } else {
                        deferred.reject("保存失败，请稍后重试。。。");
                    }
                }).error(function () {
                    deferred.reject("服务器连接失败，请稍后重试。。。");
                });
                return deferred.promise;
            };

            //通过addressId删除地址
            var remove = function (addressId) {
                var deferred = $q.defer();
                if (addressId) {
                    var url = [app.URL.addressRemove, "&id=", addressId];
                    $http.jsonp(url.join('')).success(function (data) {
                        if (data && data.result == 1) {
                            deferred.resolve(data);
                            addressCache.remove('addresses');
                        } else {
                            deferred.reject(data.message);
                        }
                    }).error(function () {
                        deferred.reject('服务器连接失败！请稍后重试。。。')
                    });
                }
                return deferred.promise;
            };


            return {
                getByCustomer: getByCustomer,
                defaultConfig: defaultConfig,
                save: save,
                remove: remove
            };
        }
    ]);
})(angular, OhFresh, undefined);