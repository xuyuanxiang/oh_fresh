(function (app, angular) {

    //注册
    //路径：index.html#/register
    app.controller('RegisterCtrl', ['$rootScope', '$scope', '$location', '$routeParams',
        'localStorageService', 'locationService', 'customerService',
        function ($rootScope, $scope, $location, $routeParams, localStorageService, locationService, customerService) {
            $rootScope.isLoading = false;

            if (!$rootScope.countries) {
                locationService();
            }


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
                                        if (locationIds.length > 0 && $rootScope.countries) {
                                            var countryId = locationIds[0];
                                            $rootScope.countries.some(function (value) {
                                                if (value.id == countryId) {
                                                    $scope.currentCustomer.country = value;
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.country.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 1 && $rootScope.provinces) {
                                            var provinceId = locationIds[1];
                                            $rootScope.provinces.some(function (value) {
                                                if (value.id == provinceId) {
                                                    $scope.currentCustomer.province = value;
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.province.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 2 && $rootScope.cities) {
                                            var cityId = locationIds[2];
                                            $rootScope.cities.some(function (value) {
                                                if (value.id == cityId) {
                                                    $scope.currentCustomer.city = value;
                                                    if ($scope.currentCustomer.homeaddress)
                                                        $scope.currentCustomer.homeaddress = $scope.currentCustomer.homeaddress.replace($scope.currentCustomer.city.name, '');
                                                    return true;
                                                }
                                            });
                                        }
                                        if (locationIds.length > 3 && $rootScope.counties) {
                                            var countyId = locationIds[3];
                                            $rootScope.counties.some(function (value) {
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