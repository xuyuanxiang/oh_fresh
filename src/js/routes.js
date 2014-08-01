(function (angular, document, app) {

    //路由设置
    app.config(['$routeProvider',
        function ($routeProvider) {
            //home
            $routeProvider.when('/home', {//主页
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            });

            //product
            $routeProvider.when('/product/detail', {//商品详情
                templateUrl: 'product/detail.html',
                controller: 'ProductDetailCtrl'
            });

            //customer
            $routeProvider.when('/login', {//登录
                templateUrl: 'customer/login.html',
                controller: 'LoginCtrl'
            });
            $routeProvider.when('/register', {//注册
                templateUrl: 'customer/register.html',
                controller: 'RegisterCtrl'
            });
            $routeProvider.when('/customer', {//用户中心
                templateUrl: 'customer/info.html',
                controller: 'CustomerInfoCtrl'
            });
            $routeProvider.when('/customer/edit', {//用户信息编辑
                templateUrl: 'customer/edit.html',
                controller: 'CustomerEditCtrl'
            });
            $routeProvider.when('/customer/qrcode', {//用户二维码
                templateUrl: 'customer/qrcode.html',
                controller: 'CustomerEditCtrl'
            });

            //address
            $routeProvider.when('/address', { //用户配送地址管理
                templateUrl: 'address/address.html',
                controller: 'AddressListCtrl'
            });
            $routeProvider.when('/address/edit', {
                templateUrl: 'address/edit.html',
                controller: 'AddressEditCtrl'
            });


            //order
            $routeProvider.when('/cart', {//购物车
                templateUrl: 'order/cart.html',
                controller: 'CartCtrl'
            });
            $routeProvider.when('/order/create', {//支付流程-配送地址选择
                templateUrl: 'order/create.html',
                controller: 'OrderCreateCtrl'
            });
            $routeProvider.when('/order/pay', {//支付流程-支付方式
                templateUrl: 'order/pay.html',
                controller: 'OrderCreateCtrl'
            });
            $routeProvider.when('/order/verify', {//支付流程-支付方式
                templateUrl: 'order/verify.html',
                controller: 'OrderCreateCtrl'
            });

            $routeProvider.otherwise({
                redirectTo: '/home'
            })
        }
    ]);
    angular.bootstrap(document, ['ohFresh']);

})(angular, document, OhFresh);
