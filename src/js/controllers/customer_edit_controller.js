;
(function (angular, app, undefined) {

    //TODO
    //用户信息编辑
    //路径：index.html#/customer/edit
    app.controller('customerEditController', [
        '$scope', '$location', 'addressService', 'localStorageService',
        function ($scope, $location, addressService, localStorageService) {
            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }
        }
    ]);
})(angular, OhFresh, undefined);