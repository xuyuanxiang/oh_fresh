(function (angular, Settings, app) {

    //用户地址的增删改查 以及 默认地址设置，与后台进行数据交互
    app.factory('addressService', ['$rootScope', '$http', '$q', 'addressCache',
        function ($rootScope, $http, $q, addressCache) {

            //通过用户ID查找地址列表
            var getByCustomer = function (customerId) {
                var deferred = $q.defer();
                var addresses = addressCache.get('addresses');
                if (addresses) {
                    deferred.resolve(addresses);
                } else {
                    var url = Settings.addressQuery + "&customerId=" + customerId;
                    $http.jsonp(url).success(function (data) {
                        addressCache.put('addresses', data);
                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject('系统连接失败！请稍后重试。。。');
                    });
                }
                return deferred.promise;
            };

            //设置用户默认收货地址
            var defaultConfig = function (customerId, addressId) {
                var deferred = $q.defer();
                var url = Settings.addressDefault + "&customerId=" + customerId + "&addressId=" + addressId;
                $http.jsonp(url).success(function (data) {
                    if (data && data.result == 1) {
                        deferred.resolve(data.message);
                    } else {
                        deferred.reject('设置失败！请稍后重试。。。');
                    }
                }).error(function () {
                    alert('系统连接失败！请稍后重试。。。');
                    deferred.reject('系统连接失败！请稍后重试。。。');
                });
                return deferred.promise;
            };

            //创建或更新地址
            var save = function (address, customerId) {
                var deferred = $q.defer();
                var url = address.id ? Settings.addressUpdate : Settings.addressCreate;
                if (address.id)
                    url += "&id=" + address.id;
                url += "&customerId=" + customerId;
                url += "&mobilephone=" + address.mobilephone;
                url += "&name=" + address.name;
                url += "&countryId=" + (address.country ? address.country.id : '');
                url += "&provinceId=" + (address.province ? address.province.id : '');
                url += "&cityId=" + (address.city ? address.city.id : '');
                url += "&countyId=" + (address.county ? address.county.id : '');
                url += "&homeaddress=" + (address.country ? address.country.name : '')
                    + (address.province ? address.province.name : '')
                    + (address.city ? address.city.name : '')
                    + (address.county ? address.county.name : '')
                    + (address.assemblename ? address.assemblename : '');
                $http.jsonp(url).success(function (data) {
                    if (data && data.result == 1) {
                        deferred.resolve(data);
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
                    var url = Settings.addressRemove + "&id=" + addressId;
                    $http.jsonp(url).success(function (data) {
                        if (data && data.result == 1) {
                            deferred.resolve(data);
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
})(angular, Settings, OhFresh);