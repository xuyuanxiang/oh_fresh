;
(function (app, angular) {

    //用户中心（底部按钮“我的”）
    //路径：index.html#/customer
    app.controller('customerHomeController', [
        '$scope', '$location', 'addressService', 'localStorageService',
        function ($scope, $location, addressService, localStorageService) {

            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }

            $scope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            $scope.logout = function () {
                if (confirm("确定要退出登录吗？")) {
                    localStorageService.remove('customer');
                    $location.url('/login');
                }
            };
        }
    ]);
})(OhFresh, angular);