(function (angular, app) {

    //用户地址列表
    //路径：index#/address?from=params=
    //from - 用户返回按钮 返回路径 为空则不显示返回按钮，形如：customer.info（即：#/customer/info）
    //params - 其他参数（预留）
    app.controller('AddressListCtrl', ['$rootScope', '$scope',
        '$routeParams', '$location', 'localStorageService', 'addressService',
        function ($rootScope, $scope, $routeParams, $location, localStorageService, addressService) {

            var customer = $rootScope.customer = angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }

            $scope.from = $routeParams.from || '';
            var params = $routeParams.params || '';


            //通过customerId,查询地址列表
            $scope.list = function (customerId) {
                var promise = addressService.getByCustomer(customerId);
                promise.then(function (data) {
                    $scope.addresses = data;
                    if (customer) {
                        $scope.addresses.some(function (item) {
                            if (customer.addressId == item.id) {
                                $scope.defaultAddress = item;
                                return true;
                            }
                        });
                    }
                });
            };

            if (customer && customer.id)
                $scope.list(customer.id);


            //返回
            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/') + '?params=' + params);
            };

            //设置默认地址
            $scope.defaultConfig = function (address) {
                if (address.id != $scope.defaultAddress.id) {
                    var promise = addressService.defaultConfig(customer.id, address.id);
                    promise.then(function (data) {
                        customer.addressId = address.id;
                        $rootScope.customer.addressId = address.id;
                        $scope.defaultAddress = address;
                        localStorageService.set('customer', angular.toJson(customer));
                    });
                }
            };

            //跳转至新增/编辑页面
            $scope.redToEdit = function (address) {
                if (!address || !address.id) {
                    $rootScope.currentAddress = {
                        name: customer.name,
                        mobilephone: customer.mobilephone
                    };
                } else {
                    $rootScope.currentAddress = address;
                }
                $location.url('/address/edit?from=' + $scope.from + '&params=' + params);
            };

            //删除地址
            $scope.remove = function (address) {
                if (address && address.id) {
                    if (confirm('确定要删除该地址吗？'))
                        addressService.remove(address.id).then(function (data) {
                            $scope.list(customer.id);
                        });
                }
            };
        }
    ]);
})(angular, OhFresh);