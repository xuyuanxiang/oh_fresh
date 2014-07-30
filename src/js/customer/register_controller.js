(function (app, angular, Settings) {

    //注册
    //路径：index.html#/register
    app.controller('RegisterCtrl', ['$rootScope', '$scope', 'localStorageService',
        '$location', '$http', 'locationService',
        function ($rootScope, $scope, localStorageService, $location, $http, locationService) {
            $rootScope.isLoading = false;

            if (!$rootScope.countries) {
                locationService();
            }
            //注册表单提交
            $scope.doRegister = function () {
                $rootScope.isLoading = true;
                if ($scope.registerForm.$valid) {
                    var url = Settings.registerUrl;
                    url += "&name=" + $scope.name;
                    url += "&mobilephone=" + $scope.mobilephone;
                    url += "&password=" + $scope.password;
                    url += "&email=" + ($scope.email ? $scope.email : '');
                    url += "&wechatcode=" + ($scope.wechatcode ? $scope.wechatcode : '');
                    url += "&countryId=" + ($scope.country ? $scope.country.id : '');
                    url += "&provinceId=" + ($scope.province ? $scope.province.id : '');
                    url += "&cityId=" + ($scope.city ? $scope.city.id : '');
                    url += "&countyId=" + ($scope.county ? $scope.county.id : '');
                    url += "&homeaddress=" + ($scope.country ? $scope.country.name : '')
                        + ($scope.province ? $scope.province.name : '')
                        + ($scope.city ? $scope.city.name : '')
                        + ($scope.county ? $scope.county.name : '')
                        + ($scope.homeaddress ? $scope.homeaddress : '');
                    $http.jsonp(url).success(function (data) {
                        $rootScope.isLoading = false;
                        alert(data.message);
                        if (data.result == 1) {
                            data.password = '';
                            localStorageService.set('customer', data);//将用户数据写入本地存储
                            $rootScope.customer = data;//当前登录用户赋值，更换底部按钮“登录”为“我的”
                            $location.url('/home');
                        }
                    }).error(function () {
                        alert('系统连接失败，请稍后再试！');
                        $rootScope.isLoading = false;
                    });
                }
            };
        }
    ]);
})(OhFresh, angular, Settings);