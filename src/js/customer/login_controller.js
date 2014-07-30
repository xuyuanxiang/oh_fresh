(function (app, Settings) {
    //登录
    //路径：index.html#/login
    app.controller('LoginCtrl', [
        '$rootScope', '$scope', '$http', 'localStorageService', '$location', '$routeParams',
        function ($rootScope, $scope, $http, localStorageService, $location, $routeParams) {
            $rootScope.currentId = $routeParams.id; //如果用户是扫码跳转至登录页面，接收存放所带参数ID
            $rootScope.isLoading = false;
            $rootScope.carts = angular.fromJson(localStorageService.get('carts')) || [];

            //如果用户已登录，则直接跳转，不进入登录页面
            //防止用户在登录状态下，通过改变地址栏，访问登录页面的路由地址
            if ($rootScope.customer) {
                //扫码跳转路径所带参数ID不等于当前用户ID则跳转至主页
                if ($rootScope.currentId && $rootScope.currentId != $rootScope.customer.id) {
                    $location.url('/home');
                } else {
                    $location.url('/customer/info');
                }
            }

            //登录表单，提交处理函数
            $scope.doLogin = function () {
                $rootScope.isLoading = true;//禁用登录按钮
                var mobileReg = new RegExp('^1[0-9]{10,11}$');//手机 正则表达式
                var emailReg = new RegExp('^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$');//邮箱 正则表达式
                var weChatReg = new RegExp('^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){5,19}$');//微信号 正则表达式
                var url = Settings.loginUrl + "&password=" + ($scope.password ? $scope.password : '');
                if (mobileReg.test($scope.account))//如果用户使用手机号登录
                    url += "&mobilephone=" + $scope.account;
                if (emailReg.test($scope.account))//如果用户使用邮箱地址登录
                    url += "&email=" + $scope.account;
                if (weChatReg.test($scope.account))//如果用户使用微信号登录
                    url += "&wechatcode=" + $scope.account;
                $http.jsonp(url).success(function (data) {
                    $rootScope.isLoading = false;//激活登陆按钮
                    if (!data || !data.id) {//登录失败
                    } else {//登录成功
                        alert('登录成功！');
                        data.password = '';
                        localStorageService.set('customer', data);//将用户数据写入本地存储
                        $rootScope.customer = data;//当前登录用户赋值，更换底部按钮“登录”为“我的”
                        //如果扫码跳转路径所带参数ID等于当前登录用户ID则跳转至用户信息页面
                        if ($rootScope.currentId == data.id) {
                            $location.url('/customer/info');
                        } else {//否则 跳转至主页
                            $location.url('/home');
                        }
                    }
                }).error(function () {//ajax 连接失败
                    $rootScope.isLoading = false;
                    alert('系统连接失败，请稍后再试！');
                });
            };
        }
    ]);
})(OhFresh, Settings);