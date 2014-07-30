(function (angular, document, app) {

    //路由设置
    app.config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.when('/home', {//主页
                templateUrl: 'home.html',
                controller: 'HomeCtrl'
            });
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

            $routeProvider.when('/order/create', {//创建订单（进入购物车）
                templateUrl: 'order/create.html',
                controller: 'OrderCreateCtrl'
            });

            $routeProvider.when('/address', { //用户配送地址管理
                templateUrl: 'address/address.html',
                controller: 'AddressListCtrl'
            });
            $routeProvider.when('/address/edit', {
                templateUrl: 'address/edit.html',
                controller: 'AddressEditCtrl'
            });

            $routeProvider.otherwise({
                redirectTo: '/home'
            })
        }
    ]);
    angular.bootstrap(document, ['ohFresh']);

})(angular, document, OhFresh);
