(function (angular, app, Settings) {

    //主页
    //路径：index.html#/home
    app.controller('HomeCtrl', ['$rootScope', '$scope', '$http', 'localStorageService', '$location',
        function ($rootScope, $scope, $http, localStorageService, $location) {

            $rootScope.customer = angular.fromJson(localStorageService.get('customer'));
            $rootScope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            $scope.init = function () {
                var url = Settings.homeUrl;
                $http.jsonp(url).success(function (data) {
                    $scope.channels = data;
                }).error(function () {
                    alert("系统连接失败！请稍后重试...");
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
                localStorageService.set('cart', angular.toJson(productIns));
                $location.url('/cart?from=home');
            }
        }
    ]);
})(angular, OhFresh, Settings);
