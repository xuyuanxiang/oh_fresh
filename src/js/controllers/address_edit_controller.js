(function (angular, app) {

    //用户地址 新增/编辑
    //路径：index.html#/address/edit
    app.controller('addressEditController', [
        '$rootScope',
        '$scope',
        '$location',
        '$routeParams',
        'addressService',
        'locationService',
        'localStorageService',
        function ($rootScope, $scope, $location, $routeParams, addressService, locationService, localStorageService) {
            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));
            if (!customer) {
                $location.url('/login');
                return;
            }
            var from = $scope.from = $routeParams.from;
            var params = $scope.params = $routeParams.params;
            $scope.address = $rootScope.currentAddress;
            if (!$scope.address) {
                $location.url('/address?from=' + from + '&params=' + params);
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

            $scope.$watch('countries', function (value) {
                $scope.provinces = value && value[0] ? (value[0].children ? value[0].children : []) : [];
            });
            $scope.$watch('provinces', function (value) {
                $scope.cities = value && value[0] ? (value[0].children ? value[0].children : []) : [];
            });
            $scope.$watch('cities', function (value) {
                $scope.counties = value && value[0] ? (value[0].children ? value[0].children : []) : [];
            });

//            var locationsIds = customer.locationId ? customer.locationId.split('|') : [];
//            查询地区列表，如果当前用户locationsIds不为空，则默认选上用户地区
            locationService().then(
                function (data) {
                    $scope.countries = data || [];
                    var locationsIds = [];
                    var location = $scope.address && $scope.address.locationId ? $scope.address.locationId : ($scope.address && $scope.address.locationfullpath ? $scope.address.locationfullpath : '' );
                    if (location)
                        locationsIds = location.split('|');
                    if ($scope.countries && locationsIds.length >= 1) {
                        $scope.countries.some(function (item) {
                            if (item.id == locationsIds[0]) {
                                $scope.address.country = item;
                                $scope.provinces = item.children;
                                $scope.address.assemblename = $scope.address.assemblename
                                    ? $scope.address.assemblename.replace(
                                    $scope.address.country.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.provinces && locationsIds.length >= 2) {
                        $scope.provinces.some(function (item) {
                            if (item.id == locationsIds[1]) {
                                $scope.address.province = item;
                                $scope.cities = item.children;
                                $scope.address.assemblename = $scope.address.assemblename
                                    ? $scope.address.assemblename.replace(
                                    $scope.address.province.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.cities && locationsIds.length >= 3) {
                        $scope.cities.some(function (item) {
                            if (item.id == locationsIds[2]) {
                                $scope.address.city = item;
                                $scope.counties = item.children;
                                $scope.address.assemblename = $scope.address.assemblename
                                    ? $scope.address.assemblename.replace(
                                    $scope.address.city.name, '') : '';
                                return true;
                            }
                        });
                    }
                    if ($scope.counties && locationsIds.length >= 4) {
                        $scope.counties.some(function (item) {
                            if (item.id == locationsIds[3]) {
                                $scope.address.county = item;
                                $scope.address.assemblename = $scope.address.assemblename
                                    ? $scope.address.assemblename.replace(
                                    $scope.address.county.name, '') : '';
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