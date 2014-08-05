(function (angular, app) {

    //用户地址 新增/编辑
    //路径：index.html#/address/edit
    app.controller('AddressEditCtrl', [
        '$rootScope', '$scope', '$location', '$routeParams', 'addressService', 'locationService', 'localStorageService',
        function ($rootScope, $scope, $location, $routeParams, addressService, locationService, localStorageService) {
            var from = $scope.from = $routeParams.from;
            var params = $scope.params = $routeParams.params;
            var customer = $rootScope.customer = $rootScope.customer
                || angular.fromJson(localStorageService.get('customer'));

            if (!customer) {
                $location.url('/login');
                return;
            }

            var locationsIds = customer.locationId ? customer.locationId.split('|') : [];
            //查询地区列表，如果当前用户locationsIds不为空，则默认选上用户地区
            locationService().then(
                function (data) {
                    $rootScope.currentAddress = $rootScope.currentAddress || {};
                    if (!locationsIds || locationsIds.length == 0)
                        locationsIds = $rootScope.currentAddress.locationfullpath ?
                            $rootScope.currentAddress.locationfullpath.split('|') : [];
                    alert(locationsIds);
                    if ($rootScope.countries && locationsIds.length >= 1) {
                        $rootScope.countries.some(function (item) {
                            if (item.id == locationsIds[0]) {
                                $rootScope.currentAddress.country = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.country.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($rootScope.provinces && locationsIds.length >= 2) {
                        $rootScope.provinces.some(function (item) {
                            if (item.id == locationsIds[1]) {
                                $rootScope.currentAddress.province = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.province.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($rootScope.cities && locationsIds.length >= 3) {
                        $rootScope.cities.some(function (item) {
                            if (item.id == locationsIds[2]) {
                                $rootScope.currentAddress.city = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.city.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($rootScope.counties && locationsIds.length >= 4) {
                        $rootScope.counties.some(function (item) {
                            if (item.id == locationsIds[3]) {
                                $rootScope.currentAddress.county = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.county.name, '') : '';
                                return true;
                            }
                        });
                    }
                }
            );

            //表单提交
            $scope.addressEditFormSubmit = function () {
                addressService.save($scope.currentAddress, customer.id).then(function (data) {
                    alert(data.message);
                    $location.url('/address?from=' + from + '&params=' + params);
                });
            };
        }
    ]);
})(angular, OhFresh);