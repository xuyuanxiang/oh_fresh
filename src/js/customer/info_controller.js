(function (app) {

    //用户中心（底部按钮“我的”）
    //路径：index.html#/customer
    app.controller('CustomerInfoCtrl', [
        '$rootScope', '$scope', 'addressService', 'localStorageService', '$location',
        function ($rootScope, $scope, addressService, localStorageService, $location) {
            var customer = $rootScope.customer = angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }

            $rootScope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            $scope.logout = function () {
                if (confirm("确定要退出登录吗？")) {
                    localStorageService.remove('customer');
                    $rootScope.customer = null;
                    $location.url('/login');
                }
            };
        }
    ]);
})(OhFresh);