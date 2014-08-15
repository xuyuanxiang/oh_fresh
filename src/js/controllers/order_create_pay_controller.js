(function (angular, app) {
    //订单创建（支付流程）
    app.controller('orderCreatePayController', ['$scope', '$routeParams', '$location', '$http',
        'addressService', 'localStorageService', 'locationService', 'customerService',
        function ($scope, $routeParams, $location, $http, addressService, localStorageService, locationService, customerService) {
            var products = $scope.products = angular.fromJson(localStorageService.get('products'));
            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));
            $scope.currentAddress = angular.fromJson(localStorageService.get('address'));

            $scope.from = $routeParams.from;

            var flag = $routeParams.params;

            $scope.payPatterns = [
                {id: 1, name: '现金支付', icon: 'img/iconfont-pay_way.png'},
                {id: 2, name: '支付宝', icon: 'img/iconfont-zhifubao.png'}
            ];

            $scope.payway = angular.fromJson(localStorageService.get('payway')) || $scope.payPatterns[0];
            $scope.payway.selected = true;

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

            $scope.selectPayway = function (pay) {
                angular.forEach($scope.payPatterns, function (value) {
                    value.selected = pay.id == value.id;
                });
                $scope.payway = pay;
                localStorageService.set('payway', angular.toJson(pay));
            };

        }
    ]);

})(angular, OhFresh);