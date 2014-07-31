(function (angular, app, Settings) {
    //订单创建（支付流程）
    app.controller('OrderCreateCtrl', ['$rootScope', '$scope', '$routeParams', '$location', '$http',
        'addressService', 'localStorageService', 'locationService',
        function ($rootScope, $scope, $routeParams, $location, $http, addressService, localStorageService, locationService) {
            var products = $scope.products = angular.fromJson(localStorageService.get('products'));
            var customer = $rootScope.customer = angular.fromJson(localStorageService.get('customer'));
            $scope.from = $routeParams.from;
            $scope.currentAddress = angular.fromJson(localStorageService.get('address')) || null;
            var flag = $routeParams.params;
            $scope.payPatterns = [
                {id: 1, name: '现金支付', icon: 'img/iconfont-pay_way.png'},
                {id: 2, name: '支付宝', icon: 'img/iconfont-zhifubao.png'}
            ];
            $scope.payway = angular.fromJson(localStorageService.get('payway')) || $scope.payPatterns[0];
            $scope.payway.selected = true;

            if (!$scope.currentAddress || !$scope.currentAddress.id) {
                locationService().then(function (data) {
                });
            }

            $scope.getAddresses = function (customerId) {
                addressService.getByCustomer(customerId).then(
                    function (data) {
                        $scope.addresses = data;
                        if ((customer && !$scope.currentAddress) || (customer && flag)) {
                            $scope.addresses.some(function (item) {
                                if (customer.addressId == item.id) {
                                    $scope.currentAddress = item;
                                    localStorageService.set('address', angular.toJson(item));
                                    return true;
                                }
                            });
                        }
                    }
                );
            };

            if (customer && customer.id)
                $scope.getAddresses(customer.id);

            $scope.total = function () {
                var totalPrice = 0;
                var totalNum = 0;
                angular.forEach($scope.products, function (product) {
                    if (product.checked) {
                        product.freight = $scope.freight ? Number($scope.freight) : 0;
                        totalPrice += Number(product.num) * Number(product.price) + Number(product.freight);
                        totalNum += 1;
                    }
                });
                return {
                    price: totalPrice + ($scope.freight ? Number($scope.freight) : 0),
                    num: totalNum
                };
            };

            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/'));
            };

            $scope.selectAddress = function (address) {
                $scope.currentAddress = address;
                localStorageService.set('address', angular.toJson(address));
                $scope.showList = false;
            };

            $scope.selectPayway = function (pay) {
                angular.forEach($scope.payPatterns, function (value) {
                    value.selected = pay.id == value.id;
                });
                $scope.payway = pay;
                localStorageService.set('payway', angular.toJson(pay));
            };

            $scope.redToPay = function () {
                if (($scope.currentAddress && $scope.currentAddress.id)
                    || ($scope.currentAddress && $scope.currentAddress.name
                        && $scope.currentAddress.mobilephone && $scope.currentAddress.assemblename
                        && $scope.currentAddress.country && $scope.currentAddress.province && $scope.currentAddress.city)) {
                    if (!$scope.currentAddress.id) {
                        var assemblename = $scope.currentAddress.country
                            && $scope.currentAddress.country.name ?
                            $scope.currentAddress.country.name : '';
                        assemblename = assemblename + ($scope.currentAddress.province
                            && $scope.currentAddress.province.name ?
                            $scope.currentAddress.province.name : '');
                        assemblename = assemblename + ($scope.currentAddress.city
                            && $scope.currentAddress.city.name ?
                            $scope.currentAddress.city.name : '');
                        assemblename = assemblename + ($scope.currentAddress.county
                            && $scope.currentAddress.county.name ?
                            $scope.currentAddress.county.name : '');
                        assemblename = assemblename + ($scope.currentAddress.assemblename ?
                            $scope.currentAddress.assemblename.replace(assemblename, '') : '');
                        $scope.currentAddress.assemblename = assemblename;
                    }
                    localStorageService.set('address', angular.toJson($scope.currentAddress));
                    $location.url('/order/pay');
                } else {
                    alert('请完善配送信息');
                }
            };

            $scope.settlement = function () {
                var url = Settings.orderCreateUrl;
                url += "&products=" + angular.toJson(products);
                url += "&name=" + ($scope.currentAddress.name ? $scope.currentAddress.name : '');
                url += "&mobilephone=" + ($scope.currentAddress.mobilephone ? $scope.currentAddress.mobilephone : '');
                url += "&customerId=" + (customer && customer.id ? customer.id : '');
                url += "&countryId=" + ($scope.currentAddress.country
                    && $scope.currentAddress.country.id ? $scope.currentAddress.country.id : '');
                url += "&provinceId=" + ($scope.currentAddress.province
                    && $scope.currentAddress.province.id ? $scope.currentAddress.province.id : '');
                url += "&cityId=" + ($scope.currentAddress.city
                    && $scope.currentAddress.city.id ? $scope.currentAddress.city.id : '');
                url += "&countyId=" + ($scope.currentAddress.county
                    && $scope.currentAddress.county.id ? $scope.currentAddress.county.id : '');
                url += "&memo=" + ($scope.memo ? $scope.memo : '');
                url += "&homeaddress=" + ($scope.currentAddress.assemblename ? $scope.currentAddress.assemblename : '');
                $http.jsonp(url).success(function (data) {
                    if (data && data.result == 1) {
                        alert(data.message);
                        localStorageService.remove('payway');
                        localStorageService.remove('address');
                        var carts = angular.fromJson(localStorageService.get('carts'));
                        carts = carts.filter(function (item) {
                            var rtn = true;
                            products.some(function (value) {
                                if (value.id == item.id) {
                                    rtn = false;
                                    return true;
                                }
                            });
                            return rtn;
                        });
                        localStorageService.remove('products');
                        localStorageService.set('carts', angular.toJson(carts));
                        $location.url('/cart');
                    }
                }).error(function () {
                    alert('服务器连接失败！请稍后重试。。。')
                });
            };
        }
    ]);

})(angular, OhFresh, Settings);