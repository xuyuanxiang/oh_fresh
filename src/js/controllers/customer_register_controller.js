;
(function (app, angular) {

    //注册
    //路径：index.html#/register
    app.controller('customerRegisterController', [
        '$scope', '$location', '$routeParams',
        'localStorageService', 'locationService', 'customerService',
        function ($scope, $location, $routeParams, localStorageService, locationService, customerService) {
            $scope.isLoading = false;


            $scope.countryChange = function (country) {
                if (country) {
                    $scope.provinces = country.children || [];
                }
            };
            $scope.provinceChange = function (province) {
                if (province) {
                    $scope.cities = province.children || [];
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

            locationService().then(function (data) {
                $scope.countries = data || [];
            });


            $scope.inputUnBlurHandler = function () {
                var mobileReg = /^1[0-9]{10,11}$/;
                if ($scope.currentCustomer && mobileReg.test($scope.currentCustomer.mobilephone)) {
                    var params = {
                        mobilephone: $scope.currentCustomer.mobilephone ? $scope.currentCustomer.mobilephone : '',
                        wechatcode: $scope.currentCustomer.wechatcode ? $scope.currentCustomer.wechatcode : '',
                        email: $scope.currentCustomer.email ? $scope.currentCustomer.email : ''
                    };
                    customerService.getByConditions(params).then(function (data) {
                            if (data.status == 0) {
                                $scope.currentCustomer = data;
                                var locationId = data.locationId;
                                if (locationId) {
                                    locationService().then(function (data) {
                                        $scope.countries = data || [];
                                        var locationIds = locationId.split('|');
                                        if (locationIds.length > 0 && $scope.countries) {
                                            var countryId = locationIds[0];
                                            $scope.countries.some(function (value) {
                                                if (value.id == countryId) {
                                                    $scope.currentCustomer.country = value;
                                                    $scope.provinces = value ? value.children : [];
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.country.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 1 && $scope.provinces) {
                                            var provinceId = locationIds[1];
                                            $scope.provinces.some(function (value) {
                                                if (value.id == provinceId) {
                                                    $scope.currentCustomer.province = value;
                                                    $scope.cities = value ? value.children : [];
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.province.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 2 && $scope.cities) {
                                            var cityId = locationIds[2];
                                            $scope.cities.some(function (value) {
                                                if (value.id == cityId) {
                                                    $scope.currentCustomer.city = value;
                                                    $scope.counties = value ? value.children : []
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.city.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 3 && $scope.counties) {
                                            var countyId = locationIds[3];
                                            $scope.counties.some(function (value) {
                                                if (value.id == countyId) {
                                                    $scope.currentCustomer.county = value;
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.county.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            $scope.mobilephoneExist = data.status != 0 && $scope.currentCustomer.mobilephone
                                && $scope.currentCustomer.mobilephone == data.mobilephone;
                            $scope.wechatcodeExist = data.status != 0 && $scope.currentCustomer.wechatcode
                                && $scope.currentCustomer.wechatcode == data.wechatcode;
                            $scope.emailExist = data.status != 0 && $scope.currentCustomer.email
                                && $scope.currentCustomer.email == data.email;
                        }
                    );
                }

            };

            $scope.currentCustomer = {
                mobilephone: $routeParams.mobilephone
            };

            if ($scope.currentCustomer.mobilephone) {
                $scope.inputUnBlurHandler();
            }

            //注册表单提交
            $scope.doRegister = function () {
                if ($scope.registerForm.$valid && !$scope.mobilephoneExist
                    && !$scope.wechatcodeExist && !$scope.emailExist) {
                    $scope.isLoading = true;
                    customerService.save($scope.currentCustomer).then(
                        function (data) {
                            $scope.isLoading = false;
                            data.password = '';
                            localStorageService.set('customer', data);//将用户数据写入本地存储
                            $location.url('/home');

                        }, function (reason) {
                            $scope.isLoading = false;
                            alert(reason);
                        }
                    );
                }
            };
        }
    ])
    ;
})(OhFresh, angular);