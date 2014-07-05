define([
    "utils/uploader",
    "utils/email"
], function(Uploader, Email) {
    return {
        Uploader: Uploader,
        Email: Email
    }
})