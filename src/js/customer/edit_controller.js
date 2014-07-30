(function (angular, Settings, app) {

    //TODO
    //用户信息编辑
    //路径：index.html#/customer/edit
    app.controller('CustomerEditCtrl', ['$rootScope', '$scope', 'addressService', 'localStorageService',
        function ($rootScope, $scope, addressService, localStorageService) {
            var customer = $rootScope.customer = $rootScope.customer || angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }
        }
    ]);
})(angular, Settings, OhFresh);