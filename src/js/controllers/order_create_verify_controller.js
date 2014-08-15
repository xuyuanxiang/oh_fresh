(function (angular, app) {
    //订单创建（支付流程）
    app.controller('orderCreateVerifyController', ['$scope', '$routeParams', '$location', '$http',
        'addressService', 'localStorageService', 'locationService', 'customerService',
        function ($scope, $routeParams, $location, $http, addressService, localStorageService, locationService, customerService) {
            var products = $scope.products = angular.fromJson(localStorageService.get('products'));
            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));
            $scope.currentAddress = angular.fromJson(localStorageService.get('address'));

            $scope.from = $routeParams.from;

            var flag = $routeParams.params;

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

            $scope.settlement = function () {
                var url = app.URL.orderCreateUrl;
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
                        if (customer && customer.id) {
                            alert('订单生成成功！');
                            $location.url('/cart');
                        } else {
                            alert('订单生成成功，您可以在登录页面输入收货人手机号查询订单信息！');
                            $location.url('/login');
                        }
                    }
                }).error(function () {
                    alert('服务器连接失败！请稍后重试。。。')
                });
            };
        }
    ]);

})(angular, OhFresh);