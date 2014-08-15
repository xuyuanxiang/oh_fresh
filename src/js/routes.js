(function (angular, document, app) {

    //路由设置
    app.config(['$routeProvider',
        function ($routeProvider) {
            //home
            $routeProvider.when('/home', {//主页
                templateUrl: 'home.html',
                controller: 'homeController'
            });

            //product
            $routeProvider.when('/product/detail', {//商品详情
                templateUrl: 'product/detail.html',
                controller: 'productDetailController'
            });

            //customer
            $routeProvider.when('/login', {//登录
                templateUrl: 'customer/login.html',
                controller: 'customerLoginController'
            });
            $routeProvider.when('/register', {//注册
                templateUrl: 'customer/register.html',
                controller: 'customerRegisterController'
            });
            $routeProvider.when('/customer', {//用户中心
                templateUrl: 'customer/home.html',
                controller: 'customerHomeController'
            });
            $routeProvider.when('/customer/edit', {//用户信息编辑
                templateUrl: 'customer/edit.html',
                controller: 'customerEditController'
            });
            $routeProvider.when('/customer/qrcode', {//用户二维码
                templateUrl: 'customer/qrcode.html',
                controller: 'customerEditController'
            });

            //address
            $routeProvider.when('/address', { //用户配送地址管理
                templateUrl: 'address/address.html',
                controller: 'addressListController'
            });
            $routeProvider.when('/address/edit', {
                templateUrl: 'address/edit.html',
                controller: 'addressEditController'
            });


            //order
            $routeProvider.when('/cart', {//购物车
                templateUrl: 'order/cart.html',
                controller: 'orderCartController'
            });
            $routeProvider.when('/order/create', {//支付流程-配送地址选择
                templateUrl: 'order/create.html',
                controller: 'orderCreateAddressController'
            });
            $routeProvider.when('/order/pay', {//支付流程-支付方式
                templateUrl: 'order/pay.html',
                controller: 'orderCreatePayController'
            });
            $routeProvider.when('/order/verify', {//支付流程-支付方式
                templateUrl: 'order/verify.html',
                controller: 'orderCreateVerifyController'
            });
            $routeProvider.when('/order/list', {// 我的订单
                templateUrl: 'order/list.html',
                controller: 'orderListController'
            });

            $routeProvider.otherwise({
                redirectTo: '/home'
            });
        }
    ]);
    angular.bootstrap(document, ['ohFresh']);

})(angular, document, OhFresh);
