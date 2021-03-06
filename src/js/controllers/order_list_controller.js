(function (angular, app) {
    app.controller('orderListController', [
        '$scope', '$routeParams', '$location', 'orderService', 'localStorageService',
        function ($scope, $routeParams, $location, orderService, localStorageService) {

            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }

            $scope.list = function (customerId, mobilephone) {
                orderService.getByConditions({customerId: customerId, mobilephone: mobilephone}).then(
                    function (data) {
                        $scope.orders = data;
                    }, function (reason) {
                        alert(reason);
                    }
                )
            };

            var customerId = $routeParams.customerId || customer.id;
            var mobilephone = $routeParams.mobilephone || customer.mobilephone;
            $scope.list(customerId, mobilephone);
            $scope.total = function (order) {
                var totalPrice = 0;
                if (order) {
                    angular.forEach(order.orderDetail, function (value) {
                        totalPrice += Number(value.productprice) * Number(value.count) + Number(value.freight);
                    });
                }
                return {
                    price: totalPrice
                }
            }
        }
    ]);
})(angular, OhFresh);