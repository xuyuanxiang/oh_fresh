(function (angular, w) {

    //依赖注入
    w.OhFresh = angular.module('ohFresh', [
        //申明依赖模块
        'ngRoute', 'ngTouch', 'angular-carousel', 'pascalprecht.translate',
        'LocalStorageModule', 'ohFresh.template', 'angularMoment'
    ]).config(['localStorageServiceProvider',
        function (localStorageServiceProvider) {
            //设置离线存储 key 的前缀
            localStorageServiceProvider.setPrefix('ohFresh');
        }
    ]);

})(angular, window);



