(function (angular, app) {
    app.factory('channelCache', [
        '$cacheFactory',
        function ($cacheFactory) {
            return $cacheFactory('channelCache');
        }
    ]).factory('channelService', [
        '$http', '$q', 'channelCache',
        function ($http, $q, channelCache) {

            //查询返回栏目列表
            var getAll = function () {
                var deferred = $q.defer();
                var url = app.URL.homeUrl;
                //先从缓存中获取
                var channels = channelCache.get('channels');
                if (channels && channels.length > 0) {
                    deferred.resolve(channels);
                } else {//缓存中没有，则调用后台接口
                    $http.jsonp(url).success(function (data) {
                        deferred.resolve(data);
                        channelCache.put('channels', data);
                    }).error(function () {
                        deferred.reject('系统链接失败！请稍后再试。。。');
                    });
                }
                return deferred.promise;
            };

            return {
                getAll: getAll
            }
        }
    ]);
})(angular, OhFresh);