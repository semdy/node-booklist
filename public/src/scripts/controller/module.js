define([
    "controller/loginCtrl"
], function(loginCtrl) {
    var Controller = {};

    /**
     * 初始化页面的controller
     */
    Controller.initPage = function() {
        loginCtrl.initPage();                   // 登录注册页面
    }

    return Controller;
})