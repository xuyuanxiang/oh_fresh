(function (angular, app, Settings) {
    app.controller('ProductDetailCtrl', [
        '$rootScope', '$scope' , '$routeParams', '$location', 'productCache',
        function ($rootScope, $scope, $routeParams, $location, productCache) {
            var from = $scope.from = $routeParams.from;
            var product = $scope.product = productCache.get('product');
            $scope.backTo = function () {
                $location.url('/' + $scope.from.replace('.', '/'));
            };
            if (!product) {
                if (from) {
                    $scope.backTo();
                } else {
                    $location.url('/home');
                }
            }


        }
    ]);
})(angular, OhFresh, Settings);