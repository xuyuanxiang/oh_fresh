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

            $scope.countryChange = function (country) {
                if (country) {
                    $scope.provinces = country.children || [];
                    $scope.cities = $scope.provinces.length > 0 ? $scope.provinces[0].children : [];
                    $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                }
            };
            $scope.provinceChange = function (province) {
                if (province) {
                    $scope.cities = province.children || [];
                    $scope.counties = $scope.cities.length > 0 ? $scope.cities[0].children : [];
                }
            };
            $scope.cityChange = function (city) {
                if (city) {
                    $scope.counties = city.children || [];
                }
            };

//            var locationsIds = customer.locationId ? customer.locationId.split('|') : [];
            //查询地区列表，如果当前用户locationsIds不为空，则默认选上用户地区
            locationService().then(
                function (data) {
                    $scope.countries = data.countries;
                    $scope.provinces = data.provinces;
                    $scope.cities = data.cities;
                    $scope.counties = data.counties;
                    $rootScope.currentAddress = $rootScope.currentAddress || {};
                    var locationsIds = [];
                    var location = $rootScope.currentAddress.locationfullpath;
                    if (location)
                        locationsIds = location.split('|');
                    if ($scope.countries && locationsIds.length >= 1) {
                        $scope.countries.some(function (item) {
                            if (item.id == locationsIds[0]) {
                                $rootScope.currentAddress.country = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.country.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.provinces && locationsIds.length >= 2) {
                        $scope.provinces.some(function (item) {
                            if (item.id == locationsIds[1]) {
                                $rootScope.currentAddress.province = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.province.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.cities && locationsIds.length >= 3) {
                        $scope.cities.some(function (item) {
                            if (item.id == locationsIds[2]) {
                                $rootScope.currentAddress.city = item;
                                $rootScope.currentAddress.assemblename = $rootScope.currentAddress.assemblename
                                    ? $rootScope.currentAddress.assemblename.replace(
                                    $rootScope.currentAddress.city.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.counties && locationsIds.length >= 4) {
                        $scope.counties.some(function (item) {
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
                var address = $scope.currentAddress;
                if (address.country) {
                    $scope.countries.some(function (item) {
                        if (item.id == address.country) {
                            address.country = item;
                            return true;
                        }
                    });
                }
                if (address.province) {
                    $scope.provinces.some(function (item) {
                        if (item.id == address.province) {
                            address.province = item;
                            return true;
                        }
                    });
                }
                if (address.city) {
                    $scope.cities.some(function (item) {
                        if (item.id == address.city) {
                            address.city = item;
                            return true;
                        }
                    });
                }
                if (address.county) {
                    $scope.counties.some(function (item) {
                        if (item.id == address.county) {
                            address.county = item;
                            return true;
                        }
                    });
                }
                addressService.save(address, customer.id).then(function (data) {
                    alert(data.message);
                    $location.url('/address?from=' + from + '&params=' + params);
                });
            };
        }
    ]);
})(angular, OhFresh);