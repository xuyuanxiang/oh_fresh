(function (angular, app, Settings) {

    //主页
    //路径：index.html#/home
    app.controller('HomeCtrl', [
        '$rootScope', '$scope', '$location', 'channelService', 'localStorageService', 'productCache',
        function ($rootScope, $scope, $location, channelService, localStorageService, productCache) {

            $rootScope.customer = angular.fromJson(localStorageService.get('customer'));
            $rootScope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            $scope.advertisements = [
                'img/home_slide01.jpg',
                'img/home_slide02.jpg'
            ];

            $scope.init = function () {
                channelService.getAll().then(function (data) {
                    $scope.channels = data;
                }, function (reason) {
                    alert(reason);
                });
            };

            $scope.init();

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

            $scope.redToDetail = function (product) {
                productCache.put('product', product);
                $location.url('/product/detail?from=home');
            }
        }
    ]);
})(angular, OhFresh, Settings);
