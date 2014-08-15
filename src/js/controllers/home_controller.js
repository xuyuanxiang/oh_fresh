;
(function (angular, app, undefined) {

    //主页
    //路径：index.html#/home
    app.controller('homeController', [
        '$rootScope', '$scope', '$location', 'channelService', 'localStorageService',
        function ($rootScope, $scope, $location, channelService, localStorageService) {

            $scope.customer = angular.fromJson(localStorageService.get('customer'));
            $scope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            //轮播广告
            $scope.advertisements = [
                'img/home_slide01.jpg',
                'img/home_slide02.jpg'
            ];

            //初始化 查询栏目（当季特卖、在线预订...）
            $scope.init = function () {
                channelService.getAll().then(function (data) {
                    $scope.channels = data;
                }, function (reason) {
                    alert(reason);
                });
            };

            $scope.init();

            //选择商品实例
            $scope.selectProductIns = function (productIns) {
                productIns.num = 1;
                $scope.currentProductIns = productIns;
            };

            //加入购物车
            $scope.addToCart = function (productIns) {
                var item = angular.copy(productIns);
                $scope.carts.push(item)
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

            //跳转至 商品详情
            $scope.redToDetail = function (product) {
                $rootScope.product = product;
                $location.url('/product/detail?from=home');
            };
        }
    ]);
})(angular, OhFresh, undefined);
