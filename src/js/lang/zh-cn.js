(function (app) {
    //i18n国际化支持
    app.config(['$translateProvider',
        function ($translateProvider) {
            $translateProvider.translations('zh-cn', {
                HOME: '主页',
                BACK: "返回",
                SAVE: "保存",
                DO_REGISTER: "注册",
                LOGIN: '登录',
                LOGINING: '正在登录...',
                REGISTER: '立即注册',
                REGISTERING: "正在注册...",
                USER_REGISTER: "用户注册",
                FORGET_PASSWORD: '忘记密码？',
                SHOPPING_CART: '购物车',
                SERVICE: '客服',
                MY: '我的',
                PLACEHOLDER_ACCOUNT: '手机号/邮箱/微信号',
                PLACEHOLDER_PASSWORD: '密码',
                PLACEHOLDER_SEARCH: "搜索关键词：商品名称...",
                ADD_TO_CART: "加入购物车",
                BUY: "购买",
                BUY_RIGHT_NOW: "立即购买",
                CATEGORY: "类目",
                REQUIRED: "不能为空！",
                REQUIRED_PLACEHOLDER: "(必填)",
                TRUE_NAME: "真实姓名：",
                TRUE_NAME_INVALID: "只能由中文字符或英文字母组成！",
                MOBILE: "手机号码：",
                MOBILE_INVALID: "只能输入由11位数字组成的字串！",
                PASSWORD: "密码：",
                PASSWORD_INVALID: "只能输入6-20位以字母开头，可以包含数字和“_”的字串！",
                PASSWORD_REPEAT: "密码确认：",
                PASSWORD_REPEAT_INVALID: "两次所输入密码不一致！",
                EMAIL: "邮箱：",
                EMAIL_INVALID: "请输入正确的邮件地址格式！",
                WECHAT: "微信号：",
                WECHAT_INVALID: " 只能输入6-20位以字母开头，可以包含数字，“_”，“.”和“-”的字串！",
                COUNTRY: "国家：",
                PROVINCE: "省市：",
                CITY: "州市：",
                COUNTY: "区县：",
                "ADDRESS": "详细地址："

            });
            $translateProvider.preferredLanguage('zh-cn');
        }
    ]);
})(OhFresh);