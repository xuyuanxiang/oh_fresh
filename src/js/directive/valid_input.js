(function (angular, app) {
    app.directive('tjValidText', function () {
        return {
            restrict: "AE",
            scope: {
                pattern: "=",
                required: "=",
                min: "=",
                max: "="
            },
            controller: function ($scope) {

            }
        }
    });
})(angular, OhFresh);