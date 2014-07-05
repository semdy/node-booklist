define([
    "jquery"
], function($) {
    /**
     * 执行登录
     * @param data
     */
    function login(data) {
        var deferred = new $.Deferred();
        if (!data) {
            deferred.reject("invalid param");
        }

        $.post("login/login", data, function(result) {
            if (result.code === "S_OK") {
                deferred.resolve({"path": "/"});
            } else {
                deferred.reject(result.code);
            }
        });

        return deferred.promise();
    }

    /**
     * 注册用户
     * @param data
     */
    function register(data) {
        var deferred = new $.Deferred();
        if (!data) {
            deferred.reject("invalid param");
        }

        $.post("login/register", data, function(result) {
            if (result.code === "S_OK") {
                deferred.resolve({"path": "/"});
            } else {
                deferred.reject(result.code);
            }
        });

        return deferred.promise();
    }

    return {
        login: login,
        register: register
    }
})