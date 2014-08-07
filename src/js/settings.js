(function (w) {

    //服务端接口路径
//    var baseUrl = 'http://221.213.101.79:8080/tjpowermgm/';
    var baseUrl = 'http://192.168.0.101:8080/tjpowermgm/';
//    var baseUrl = 'http://localhost:8080/tjpowermgm/';
    w.Settings = {
        customerQuery: baseUrl + 'customers?callback=JSON_CALLBACK',//登录
        registerUrl: baseUrl + 'customer/save?callback=JSON_CALLBACK',//注册
        homeUrl: baseUrl + 'productins/getFrontPageMessage?callback=JSON_CALLBACK',//获取首页内容
        orderCreateUrl: baseUrl + 'eorder/save?callback=JSON_CALLBACK',//生成订单
        orderQueryUrl: baseUrl + 'EOrder/getOrderByAdmin?callback=JSON_CALLBACK',//订单查询
        locationUrl: baseUrl + 'customer/getArea?callback=JSON_CALLBACK',//获取下拉地址列表
        addressQuery: baseUrl + 'eaddress/getReceversByCustomerId?callback=JSON_CALLBACK',//查询地址
        addressUpdate: baseUrl + 'eaddress/updateAddress?callback=JSON_CALLBACK',//更新地址
        addressCreate: baseUrl + 'eaddress/saveAddress?callback=JSON_CALLBACK',//新建地址
        addressRemove: baseUrl + 'eaddress/deleteAddress?callback=JSON_CALLBACK',//删除地址
        addressDefault: baseUrl + 'customer/changeAddressId?callback=JSON_CALLBACK'//设置默认地址
    };

})(window);
