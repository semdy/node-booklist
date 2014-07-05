/**
 * HTML5 文件上传
 * 支持分块上传，断点续传
 *
 * base on :https://github.com/sthielen/BigUpload.git
 *
 * usage:
 *  var uploader = new Uploader();
 *  function upload() {
 *      uploader.fire();
 *  }
 *
 *  function abort() {
 *      uploader.abortFileUpload();
 *  }
 *
 */
define([], function() {
    function Uploader () {

        // 配置参数
        this.settings = {
            // file input元素的id
            'inputField': 'uploadFile',

            // 包含file input元素的form表单id
            'formId': 'uploadForm',

            // 进度条的id
            // bigUpload.progressUpdate()
            'progressBarField': 'uploadProgressBarFilled',

            // 剩余时间的id
            // bigUpload.progressUpdate()
            'timeRemainingField': 'uploadTimeRemaining',

            // 响应区域的id
            // 显示服务器返回的成功或失败的信息
            'responseField': 'uploadResponse',

            // 提交按钮的id
            // 会根据上传状态修改为：暂停/恢复
            'submitButton': 'uploadSubmit',

            // 进度条的颜色
            // 应该定义在CSS中
            // 默认：green
            'progressBarColor': '#5bb75b',

            // 发生错误时进度条的背景颜色
            // 默认：red
            'progressBarColorError': '#da4f49',

            // 处理请求的地址
            'scriptPath': '',

            // 附加在请求地址上的参数
            // ex: &foo=bar
            'scriptPathParams': '',

            // 每次上传的块大小（bytes）
            // 默认: 1MB
            'chunkSize': 1048576,

            // 文件的最大值
            // 默认: 2GB
            'maxFileSize': 2147483648
        };

        // 文件上传时的变量
        this.uploadData = {
            'uploadStarted': false,
            'file': false,
            'numberOfChunks': 0,
            'aborted': false,
            'paused': false,
            'pauseChunk': 0,
            'key': 0,
            'timeStart': 0,
            'totalTime': 0
        };

        // 上传成功时的回调
        this.success = function(response) {

        };

        parent = this;

        this.$ = function(id) {
            return document.getElementById(id);
        };

        /**
         * 用于在发起一个新的上传请求时重设变量值
         */
        this.resetKey = function() {
            this.uploadData = {
                'uploadStarted': false,
                'file': false,
                'numberOfChunks': 0,
                'aborted': false,
                'paused': false,
                'pauseChunk': 0,
                'key': 0,
                'timeStart': 0,
                'totalTime': 0
            };
        };

        /**
         * 初始方法调用
         * 决定上传操作：begin/pause/resume
         */
        this.fire = function() {
            if(this.uploadData.uploadStarted === true && this.uploadData.paused === false) {
                this.pauseUpload();
            }
            else if(this.uploadData.uploadStarted === true && this.uploadData.paused === true) {
                this.resumeUpload();
            }
            else {
                this.processFiles();
            }

        };

        /**
         * 文件上传
         * 获取已上传文件大小和计算分块数量
         */
        this.processFiles = function() {

            // 浏览器不支持File API
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                this.$(this.settings.formId).submit();
                return;
            }

            // 重设上传变量值
            this.resetKey();
            this.uploadData.uploadStarted = true;

            // 调整显示
            this.$(this.settings.progressBarField).style.backgroundColor = this.settings.progressBarColor;
            this.$(this.settings.responseField).textContent = 'Uploading...';
            this.$(this.settings.submitButton).value = 'Pause';

            // 获取File
            this.uploadData.file = this.$(this.settings.inputField).files[0];

            // 检查文件大小
            var fileSize = this.uploadData.file.size;
            if(fileSize > this.settings.maxFileSize) {
                this.printResponse('The file you have chosen is too large.', true);
                return;
            }

            // 计算文件分块数量
            this.uploadData.numberOfChunks = Math.ceil(fileSize / this.settings.chunkSize);

            // 开始上传
            this.sendFile(0);
        };

        /**
         * 执行上传过程
         * @param chunk {number}
         */
        this.sendFile = function (chunk) {

            // 设置上传开始时间，用于计算剩余时间
            this.uploadData.timeStart = new Date().getTime();

            // 检查上传是否已经被终止
            if(this.uploadData.aborted === true) {
                return;
            }

            // 检查上传是否已经被暂停
            if(this.uploadData.paused === true) {
                this.uploadData.pauseChunk = chunk;
                this.printResponse('Upload paused.', false);
                return;
            }

            // 设置上传字节的开始与结束位置
            var start = chunk * this.settings.chunkSize;
            var stop = start + this.settings.chunkSize;

            // 初始化FileReader，用于读取File
            var reader = new FileReader();

            // 当读取完成时触发该函数，无论是成功还是失败
            reader.onloadend = function(evt) {

                // 构造一个AJAX请求
                // this.uploadData.key是一个临时的文件名
                // 如果服务器发现该值为0，服务器应该主动生成一个新的文件名并且将其返回
                // this.uploadData.key会用于接下来的请求
                // 如果该值不为0，服务器应该将数据直接添加到该值指定的文件后
                xhr = new XMLHttpRequest();
                xhr.open("POST", parent.settings.scriptPath + '?action=upload&key=' + parent.uploadData.key + parent.settings.scriptPathParams, true);
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                xhr.onreadystatechange = function() {
                    if(xhr.readyState == 4) {
                        var response = JSON.parse(xhr.response);

                        // 失败，终止上传
                        if(response.errorStatus !== 0 || xhr.status != 200) {
                            parent.printResponse(response.errorText, true);
                            return;
                        }

                        // 如果是第一个分块，设置key值
                        if(chunk === 0 || parent.uploadData.key === 0) {
                            parent.uploadData.key = response.key;
                        }

                        // 上传未完成，接着上传下一个分块
                        if(chunk < parent.uploadData.numberOfChunks) {
                            parent.progressUpdate(chunk + 1);
                            parent.sendFile(chunk + 1);
                        }
                        // 上传完成
                        else {
                            parent.sendFileData();
                        }

                    }

                };

                // 发送文件分块
                xhr.send(blob);
            };

            // 重要
            // 切割文件
            var blob = this.uploadData.file.slice(start, stop);
            reader.readAsBinaryString(blob);
        };

        /**
         * 当上传完成时调用此方法
         */
        this.sendFileData = function() {
            var data = 'key=' + this.uploadData.key + '&name=' + this.uploadData.file.name;
            xhr = new XMLHttpRequest();
            xhr.open("POST", parent.settings.scriptPath + '?action=finish', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    var response = JSON.parse(xhr.response);

                    //If there's an error, call the error method
                    if(response.errorStatus !== 0 || xhr.status != 200) {
                        parent.printResponse(response.errorText, true);
                        return;
                    }

                    //Reset the upload-specific data so we can process another upload
                    parent.resetKey();

                    //Change the submit button text so it's ready for another upload and spit out a sucess message
                    parent.$(parent.settings.submitButton).value = 'Start Upload';
                    parent.printResponse('File uploaded successfully.', false);

                    parent.success(response);
                }
            };

            xhr.send(data);
        };

        /**
         * 取消文件上传。服务器应该删除临时文件
         */
        this.abortFileUpload = function() {
            this.uploadData.aborted = true;
            var data = 'key=' + this.uploadData.key;
            xhr = new XMLHttpRequest();
            xhr.open("POST", this.settings.scriptPath + '?action=abort', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) {
                    var response = JSON.parse(xhr.response);

                    if(response.errorStatus !== 0 || xhr.status != 200) {
                        parent.printResponse(response.errorText, true);
                        return;
                    }
                    parent.printResponse('File upload was cancelled.', true);
                }

            };

            xhr.send(data);
        };

        /**
         * 暂停文件上传
         * 当前上传的文件块会保存在this.uploadData.pauseChunk中，故可以恢复上传
         * 需要注意的是服务器要主动去清理临时文件，因为用户有可能暂停后就离开了页面
         */
        this.pauseUpload = function() {
            this.uploadData.paused = true;
            this.printResponse('', false);
            this.$(this.settings.submitButton).value = 'Resume';
        };

        /**
         * 恢复文件上传
         */
        this.resumeUpload = function() {
            this.uploadData.paused = false;
            this.$(this.settings.submitButton).value = 'Pause';
            this.sendFile(this.uploadData.pauseChunk);
        };

        /**
         * 计算上传进度和剩余时间
         * @param progress
         */
        this.progressUpdate = function(progress) {

            var percent = Math.ceil((progress / this.uploadData.numberOfChunks) * 100);
            this.$(this.settings.progressBarField).style.width = percent + '%';
            this.$(this.settings.progressBarField).textContent = percent + '%';

            // 估算剩余时间
            // 每上传5个分块时计算一次
            if(progress % 5 === 0) {

                // 计算已上传文件分块的总时间
                this.uploadData.totalTime += (new Date().getTime() - this.uploadData.timeStart);
                console.log(this.uploadData.totalTime);

                // 计算上传速度，然后计算剩余时间
                var timeLeft = Math.ceil((this.uploadData.totalTime / progress) * (this.uploadData.numberOfChunks - progress) / 100);
                console.log(Math.ceil(((this.uploadData.totalTime / progress) * this.settings.chunkSize) / 1024) + 'kb/s');

                // 更新显示
                this.$(this.settings.timeRemainingField).textContent = timeLeft + ' seconds remaining';
            }
        };

        /**
         * 响应/错误处理
         * @param responseText
         * @param error
         */
        this.printResponse = function(responseText, error) {
            this.$(this.settings.responseField).textContent = responseText;
            this.$(this.settings.timeRemainingField).textContent = '';
            if(error === true) {
                this.$(this.settings.progressBarField).style.backgroundColor = this.settings.progressBarColorError;
            }
        };
    }

    return Uploader;
})
