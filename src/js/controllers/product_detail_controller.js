(function (angular, app, undefined) {
    app.controller('productDetailController', [
        '$rootScope', '$scope' , '$routeParams', '$location', 'localStorageService',
        function ($rootScope, $scope, $routeParams, $location, localStorageService) {
            var from = $scope.from = $routeParams.from;
            var product = $rootScope.product;
            $scope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/'));
            };

            if (!product) {
                if (from) {
                    $scope.backTo();
                } else {
                    $location.url('/home');
                }
            }

            $scope.selectProductIns = function (productIns) {
                productIns.num = 1;
                $scope.currentProductIns = productIns;
            };
            //加入购物车
            $scope.addToCart = function (productIns) {
                var item = angular.copy(productIns);
                $scope.carts.push(item);
                localStorageService.set('carts', angular.toJson($scope.carts));
                alert('加入成功！');
            };
            //立即购买
            $scope.purchaseNow = function (productIns) {
                var item = angular.copy(productIns);
                $scope.carts.push(item);
                localStorageService.set('carts', angular.toJson($scope.carts));
                $location.url('/cart');
            };

            $scope.buySubmit = function (buyType, productIns) {
                if (buyType == 1) {
                    $scope.addToCart(productIns);
                } else if (buyType == 2) {
                    $scope.purchaseNow(productIns);
                }
            };

        }
    ]);
})(angular, OhFresh, undefined);