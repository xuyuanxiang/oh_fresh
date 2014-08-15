(function (angular, app) {
    //订单创建（支付流程）
    app.controller('orderCreateAddressController', ['$scope', '$routeParams', '$location', '$http',
        'addressService', 'localStorageService', 'locationService', 'customerService',
        function ($scope, $routeParams, $location, $http, addressService, localStorageService, locationService, customerService) {
            var products = $scope.products = angular.fromJson(localStorageService.get('products'));
            var customer = $scope.customer = angular.fromJson(localStorageService.get('customer'));
            $scope.currentAddress = angular.fromJson(localStorageService.get('address'));

            $scope.from = $routeParams.from;

            var flag = $routeParams.params;

            $scope.total = function () {
                var totalPrice = 0;
                var totalNum = 0;
                angular.forEach($scope.products, function (product) {
                    if (product.checked) {
                        product.freight = $scope.freight ? Number($scope.freight) : 0;
                        totalPrice += Number(product.num) * Number(product.price) + Number(product.freight);
                        totalNum += 1;
                    }
                });
                return {
                    price: totalPrice + ($scope.freight ? Number($scope.freight) : 0),
                    num: totalNum
                };
            };
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

            locationService().then(function (data) {
                $scope.countries = data || [];
                var address = angular.fromJson(localStorageService.get('address')) || null;
                if (address) {
                    $scope.currentAddress = address;
                    if ($scope.countries) {
                        $scope.countries.some(function (value) {
                            if (address.country && value.id == address.country.id) {
                                $scope.currentAddress.country = value;
                                $scope.provinces = value.children;
                                return true;
                            }
                        });
                    }
                    if ($scope.provinces) {
                        $scope.provinces.some(function (value) {
                            if (address.province && value.id == address.province.id) {
                                $scope.currentAddress.province = value;
                                $scope.cities = value.children;
                                return true;
                            }
                        });
                    }
                    if ($scope.cities) {
                        $scope.cities.some(function (value) {
                            if (address.city && value.id == address.city.id) {
                                $scope.currentAddress.city = value;
                                $scope.counties = value.children;
                                return true;
                            }
                        });
                    }
                    if ($scope.counties) {
                        $scope.counties.some(function (value) {
                            if (address.county && value.id == address.county.id) {
                                $scope.currentAddress.county = value;
                                return true;
                            }
                        });
                    }
                }

            }, function (reason) {
                alert(reason);
            });

            $scope.$watch('currentAddress.country', function (newValue, oldValue) {
                var assemblename = $scope.currentAddress ? $scope.currentAddress.assemblename : '';
                if (newValue && assemblename && assemblename.indexOf(newValue.name) >= 0) {
                    $scope.currentAddress.assemblename = assemblename.replace(oldValue.name, newValue.name);
                }
            });
            $scope.$watch('currentAddress.province', function (newValue, oldValue) {
                var assemblename = $scope.currentAddress ? $scope.currentAddress.assemblename : '';
                if (newValue && assemblename && assemblename.indexOf(newValue.name) >= 0) {
                    $scope.currentAddress.assemblename = assemblename.replace(oldValue.name, newValue.name);
                }
            });
            $scope.$watch('currentAddress.city', function (newValue, oldValue) {
                var assemblename = $scope.currentAddress ? $scope.currentAddress.assemblename : '';
                if (newValue && assemblename && assemblename.indexOf(newValue.name) >= 0) {
                    $scope.currentAddress.assemblename = assemblename.replace(oldValue.name, newValue.name);
                }
            });
            $scope.$watch('currentAddress.county', function (newValue, oldValue) {
                var assemblename = $scope.currentAddress ? $scope.currentAddress.assemblename : '';
                if (newValue && assemblename && assemblename.indexOf(newValue.name) >= 0) {
                    $scope.currentAddress.assemblename = assemblename.replace(oldValue.name, newValue.name);
                }
            });

            $scope.getAddresses = function (customerId) {
                locationService().then(function (data) {
                    addressService.getByCustomer(customerId).then(
                        function (data) {
                            $scope.addresses = data;
                            if ((customer && (!$scope.currentAddress
                                || !$scope.currentAddress.name || !$scope.currentAddress.mobilephone
                                || !$scope.currentAddress.assemblename || !$scope.currentAddress.country
                                || !$scope.currentAddress.province || !$scope.currentAddress.city)) || (customer && flag)) {
                                $scope.addresses.some(function (item) {
                                    if (customer.addressId == item.id) {
                                        $scope.currentAddress = item;
                                        localStorageService.set('address', item);
                                        return true;
                                    }
                                });
                                if (customer && !$scope.currentAddress) {
                                    $scope.currentAddress = {
                                        name: customer.name ? customer.name : '',
                                        mobilephone: customer.mobilephone ? customer.mobilephone : ''
                                    }
                                }
                            }
                        }
                    );
                });

            };

            if (customer && customer.id)
                $scope.getAddresses(customer.id);

            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/'));
            };

            $scope.selectAddress = function (address) {
                $scope.currentAddress = address;
                localStorageService.set('address', angular.toJson(address));
                $scope.showList = false;
            };

            $scope.redToPay = function () {
                if (($scope.currentAddress && $scope.currentAddress.id)
                    || ($scope.currentAddress && $scope.currentAddress.name
                        && $scope.currentAddress.mobilephone && $scope.currentAddress.assemblename
                        && $scope.currentAddress.country && $scope.currentAddress.province && $scope.currentAddress.city)) {
                    var assemblename = $scope.currentAddress.country
                        && $scope.currentAddress.country.name ?
                        $scope.currentAddress.country.name : '';

                    assemblename = assemblename + ($scope.currentAddress.province
                        && $scope.currentAddress.province.name ?
                        $scope.currentAddress.province.name : '');
                    assemblename = assemblename + ($scope.currentAddress.city
                        && $scope.currentAddress.city.name ?
                        $scope.currentAddress.city.name : '');
                    assemblename = assemblename + ($scope.currentAddress.county
                        && $scope.currentAddress.county.name ?
                        $scope.currentAddress.county.name : '');
                    assemblename = assemblename + ($scope.currentAddress.assemblename ?
                        $scope.currentAddress.assemblename.replace(assemblename, '') : '');
                    $scope.currentAddress.assemblename = assemblename;
                    localStorageService.set('address', angular.toJson($scope.currentAddress));
                    $location.url('/order/pay');
                } else {
                    alert('请完善配送信息');
                }
            };



        }
    ]);

})(angular, OhFresh);