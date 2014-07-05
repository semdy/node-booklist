define([
    "jquery",
    "utils/module",
    "service/loginService",
    "bootstrap"
], function($, utils, loginService) {
    var Email = utils.Email;

    /**
     * 初始化页面
     */
    function initPage() {
        _initUI();
        _initForm();
    }



    /*--------------------------    private method    --------------------------*/

    /**
     * 初始化页面的UI组件
     */
    function _initUI() {
        /* 初始化tab */
        $("#loginTab a").click(function(evt) {
            evt.preventDefault();
            $(this).tab("show");
        })
    }

    /**
     * 初始化表单
     * @private
     */
    function _initForm() {
        _initLoginForm();
        _initRegisterForm();
    }

    /**
     * 初始化登录表单
     * @private
     */
    function _initLoginForm() {
        var $loginForm = $("#loginForm");
        var loginForm = $loginForm[0];
        $loginForm.on("submit", function(evt) {
            evt.preventDefault();
            $("#loginForm .help-block").remove();
            var illegal = false;
            _validate(loginForm, function(isEmpty, elem) {
                if (isEmpty) {
                    $(elem).closest(".form-group").addClass("has-error");
                    return (illegal = true);
                } else {
                    $(elem).closest(".form-group").removeClass("has-error");
                }
            });

            if (illegal) {
                return false;
            }

            loginService.login({
                "name": $.trim(loginForm.name.value),
                "password": $.trim(loginForm.password.value),
                "autoLogin": $("input[name=autoLogin]", loginForm).is(":checked") ? 1 : 0
            }).then(function(result) {
                document.location.href = result.path;
            }, function(code) {
                $("#loginForm #name").closest(".form-group").addClass("has-error");
                $("#loginForm #name").closest(".form-group").append("<span class='help-block'>登录失败</span>")
            });
        });
    }

    /**
     * 初始化注册表单
     * @private
     */
    function _initRegisterForm() {
        var $regForm = $("#registerForm");
        var regForm = $regForm[0];
        $regForm.on("submit", function(evt) {
            evt.preventDefault();
            var illegal = false;
            _validate(regForm, function(isEmpty, elem) {
                if (isEmpty || (elem.name === "email" && !Email.isEmail($.trim(elem.value)))) {
                    $(elem).closest(".form-group").addClass("has-error");
                    return (illegal = true);
                } else {
                    $(elem).closest(".form-group").removeClass("has-error");
                    $(".help-block", elem).closest(".form-group").remove();
                }

            });

            if (illegal) {
                return false;
            }

            if ($.trim(regForm["password"].value) !== $.trim(regForm["repeatPassword"].value)) {
                var $rePassword = $(regForm["repeatPassword"]);
                $rePassword.closest(".form-group").addClass("has-error");
                $rePassword.closest(".form-group").append("<span class='help-block'>两次密码不相同</span>");
                return false;
            }

            loginService.register({
                "name": $.trim(regForm.name.value),
                "email": $.trim(regForm.email.value),
                "password": $.trim(regForm.password.value),
                "repeatPassword": $.trim(regForm.repeatPassword.value)
            }).then(function(result) {
                document.location.href = result.path;
            }, function(code) {
                $("#registerForm #name").closest(".form-group").addClass("has-error");
                $("#registerForm #name").closest(".form-group").append("<span class='help-block'>注册失败</span>")
            });
        });
    }

    /**
     * 校验表单字段。这里只是简单校验为空
     * @param form 表单元素
     * @param callback 每校验一个字段执行该回调方法
     * @private
     */
    function _validate(form, callback) {
        callback = callback || $.noop;
        var elems = form.elements,
            hasEmpty = false,
            elem, type, result;

        for (var i = 0, size = elems.length; i < size; i++) {
            elem = elems[i];
            type = elem.type.toLowerCase();
            if (elem.tagName.toLowerCase() === "input" &&
                (type === "text" || type === "password")) {
                if ($.trim(elem.value) === "") {
                    result = callback(true, elem);
                    hasEmpty = true;
                } else {
                    result = callback(false, elem);
                }

                // 终止循环
                if (result) {
                    break;
                }
            }
        }

        return hasEmpty;
    }

    return {
        initPage: initPage
    }
})