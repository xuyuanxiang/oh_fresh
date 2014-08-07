(function (angular, app, Settings) {
    app.controller('ProductDetailCtrl', [
        '$rootScope', '$scope' , '$routeParams', '$location', 'productCache', 'localStorageService',
        function ($rootScope, $scope, $routeParams, $location, productCache, localStorageService) {
            var from = $scope.from = $routeParams.from;
            var product = $scope.product = productCache.get('product');
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
                var flag = false;
                if (angular.isArray($rootScope.carts)) {
                    $rootScope.carts = $rootScope.carts.filter(function (item) {
                        if (item.id == productIns.id) {
                            alert('购物车中已包含该商品！');
                            flag = true;
                        }
                        return item.id != productIns.id;
                    });
                }
                $rootScope.carts.push(productIns);
                localStorageService.set('carts', angular.toJson($rootScope.carts));
                if (!flag)
                    alert('加入成功！');
            };
            //立即购买
            $scope.purchaseNow = function (productIns) {
                if (angular.isArray($rootScope.carts)) {
                    $rootScope.carts = $rootScope.carts.filter(function (item) {
                        return item.id != productIns.id;
                    });
                }
                $rootScope.carts.push(productIns);
                localStorageService.set('carts', angular.toJson($rootScope.carts));
                $location.url('/cart');
            };

        }
    ]);
})(angular, OhFresh, Settings);