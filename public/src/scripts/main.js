require.config({
    paths: {
        "jquery": "../vendors/jquery/jquery-1.11.1",
        "bootstrap": "../vendors/bootstrap/bootstrap"
    },
    shim: {
        "bootstrap": ["jquery"]
    }
});

require([
    "jquery",
    "controller/module"
], function($, Controller) {
    $(function() {
        Controller.initPage();
    });
});