(function (angular, Settings, app) {

    //订单创建
    //路径：index.html#/cart?from=
    app.controller('CartCtrl', ['$rootScope', '$scope', '$location',
        '$routeParams', 'localStorageService',
        //依赖注入所需服务，$开头为angular框架自带。
        // scope存储用户视图显示的model数据
        // 其中：$rootScope 全局唯一（即所有的controller都可访问）；
        // $scope 当前controller域
        function ($rootScope, $scope, $location, $routeParams, localStorageService) {

            $scope.products = [];
            $scope.from = $routeParams.from;
            $rootScope.customer = angular.fromJson(localStorageService.get('customer'));

            if ($routeParams.from) {//用户点击“立即购买”跳转进入，id不为空；
                // 立即购买的商品
                var product = angular.fromJson(localStorageService.get('cart')) || {};
                product.checked = true;
                $scope.products.push(product);
            } else {// 用户点击底部“购物车”按钮跳转进入，id为空。
                // 购物车商品列表
                $rootScope.carts = angular.fromJson(localStorageService.get('carts')) || [];
                $scope.products = $rootScope.carts;
            }


            $scope.total = function () {
                var totalPrice = 0;
                var totalNum = 0;
                var products = [];
                angular.forEach($scope.products, function (product) {
                    if (product.checked) {
                        product.freight = $scope.freight ? Number($scope.freight) : 0;
                        totalPrice += Number(product.num) * Number(product.price) + Number(product.freight);
                        totalNum += 1;
                        products.push(product);
                    }
                });
                return {
                    price: totalPrice + ($scope.freight ? Number($scope.freight) : 0),
                    num: totalNum,
                    products: products
                };
            };

            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/'));
            };

            $scope.removeFromCart = function (product) {
                $scope.products = $scope.products.filter(function (item) {
                    return item.id != product.id;
                });
                if (!$scope.from) {
                    $rootScope.carts = $scope.products;
                    localStorageService.set('carts', angular.toJson($rootScope.carts));
                }
            };

            $scope.selectAll = function () {
                var checked = $scope.products.length == $scope.total().products.length;
                angular.forEach($scope.products, function (value) {
                    value.checked = !checked;
                });
            };

            $scope.settlement = function () {
                localStorageService.set('products', angular.toJson($scope.total().products));
                $location.url('/order/create?from=cart');
            };
        }
    ]);
})(angular, Settings, OhFresh);