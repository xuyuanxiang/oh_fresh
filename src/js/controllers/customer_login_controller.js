;
(function (app, angular) {
    //登录
    //路径：index.html#/login
    app.controller('customerLoginController', [
        '$scope', '$location', '$routeParams', 'localStorageService', 'customerService',
        function ($scope, $location, $routeParams, localStorageService, customerService) {
            var currentId = $routeParams.id; //如果用户是扫码跳转至登录页面，接收存放所带参数ID
            $scope.carts = angular.fromJson(localStorageService.get('carts')) || [];
            $scope.customer = angular.fromJson(localStorageService.get('customer'));

            //如果用户已登录，则直接跳转，不进入登录页面
            //防止用户在登录状态下，通过改变地址栏，访问登录页面的路由地址
            if ($scope.customer) {
                //扫码跳转路径所带参数ID不等于当前用户ID则跳转至主页
                if (currentId && currentId != $scope.customer.id) {
                    $location.url('/home');
                } else {
                    $location.url('/customer/info');
                }
            }

            $scope.$watch('account', function (value) {
                var mobileReg = new RegExp('^1[0-9]{10,11}$');//手机 正则表达式
                if (mobileReg.test(value)) {
                    var params = {
                        mobilephone: value
                    };
                    customerService.getByConditions(params).then(function (data) {
                        if (data.status == 0) {
                            alert('账号未激活！请完善您的信息后，点击注册按钮激活账号。');
                            $location.url('/register?mobilephone=' + data.mobilephone);
                        }
                    });
                }
            });

            //登录表单，提交处理函数
            $scope.doLogin = function () {
                $scope.isLoading = true;//禁用登录按钮
                var mobileReg = new RegExp('^1[0-9]{10,11}$');//手机 正则表达式
                var emailReg = new RegExp('^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$');//邮箱 正则表达式
                var weChatReg = new RegExp('^[a-zA-Z]{1}([a-zA-Z0-9]|[._-]){5,19}$');//微信号 正则表达式
                var params = {};
                params.mobilephone = mobileReg.test($scope.account) ? $scope.account : '';
                params.email = emailReg.test($scope.account) ? $scope.account : '';
                params.wechatcode = weChatReg.test($scope.account) ? $scope.account : '';
                params.password = $scope.password ? $scope.password : '';
                customerService.getByConditions(params).then(
                    function (data) {
                        $scope.isLoading = false;//激活登陆按钮
                        if (data && data.status == 0 && data.mobilephone) {
                            alert('账号未激活！请完善您的信息后，点击注册按钮激活账号。');
                            $location.url('/register?mobilephone=' + data.mobilephone);
                        } else if (data && data.status == 1 && $scope.password == data.password) {
                            alert('登录成功！');
                            data.password = '';
                            localStorageService.set('customer', angular.toJson(data));//将用户数据写入本地存储
                            $scope.customer = data;
                            if (currentId == data.id) {
                                $location.url('/customer/info');
                            } else {//否则 跳转至主页
                                $location.url('/home');
                            }
                        } else if (data && data.status == -1) {
                            alert('账号已注销！');
                        } else {
                            alert('帐号或密码输入错误！');
                        }
                    }
                    , function (reason) {
                        $scope.isLoading = false;//激活登陆按钮
                        alert(reason);
                    }
                );
            };
        }
    ]);
})(OhFresh, angular);