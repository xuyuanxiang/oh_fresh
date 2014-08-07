(function (app, angular) {

    //注册
    //路径：index.html#/register
    app.controller('RegisterCtrl', ['$rootScope', '$scope', '$location', '$routeParams',
        'localStorageService', 'locationService', 'customerService',
        function ($rootScope, $scope, $location, $routeParams, localStorageService, locationService, customerService) {
            $rootScope.isLoading = false;


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

            locationService().then(function (data) {
                $scope.countries = data.countries;
                $scope.provinces = data.provinces;
                $scope.cities = data.cities;
                $scope.counties = data.counties;
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
                                        var locationIds = locationId.split('|');
                                        if (locationIds.length > 0 && $scope.countries) {
                                            var countryId = locationIds[0];
                                            $scope.countries.some(function (value) {
                                                if (value.id == countryId) {
                                                    $scope.currentCustomer.country = value;
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
                $rootScope.isLoading = true;
                if ($scope.registerForm.$valid && !$scope.mobilephoneExist
                    && !$scope.wechatcodeExist && !$scope.emailExist) {
                    customerService.save($scope.currentCustomer).then(
                        function (data) {
                            $rootScope.isLoading = false;
                            data.password = '';
                            localStorageService.set('customer', data);//将用户数据写入本地存储
                            $rootScope.customer = data;//当前登录用户赋值，更换底部按钮“登录”为“我的”
                            $location.url('/home');

                        }, function (reason) {
                            $rootScope.isLoading = false;
                            alert(reason);
                        }
                    );
                }
            };
        }
    ])
    ;
})(OhFresh, angular);