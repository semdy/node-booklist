define([], function() {
    var Email = {};

    /**
     * 检测是否为合法的邮件地址
     * @param email
     * @returns {boolean}
     */
    Email.isEmail = function(email) {
        if ((email.length > 128) || (email.length < 6)) {
            return false;
        }

        var format = /^[A-Za-z0-9+]+[A-Za-z0-9_.+-]*@([A-Za-z0-9-]+\.)+[A-Za-z0-9]+$/;
        if (!email.match(format)) {
            return false;
        }
        return true;
    }

    return Email;
})