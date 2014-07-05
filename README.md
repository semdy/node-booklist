## booklist
使用nodejs + mysql + express4 + ejs + grunt + bootstrap + semantic ui 构建的一个书籍展示应用

**注意：**该项目重点在于用nodejs构建项目的流程，所以有些业务逻辑并没有补充完整，目前只是补充了登录注册。

详情请查看[wiki](https://github.com/gcfeng/booklist/wiki)

## 部署
### 前端
    cd public
    npm install
    grunt

    // 在开发模式下监听文件修改
    grunt watch

### 后端
    npm install
    // 开发模式下，默认为开发模式
    grunt
    node master

    // 发布模式下
    grunt prod
    node master prod

### 执行测试
    npm install -g mocha

    // 进入到booklist目录，执行以下命令，程序会自动执行test目录下的所有文件
    mocha

    // 单独执行某个测试文件
    cd booklist/test
    mocha bdd.js

    // mocha默认的模式是BDD，如果要执行TDD，需要额外参数
    mocha -u tdd tdd.js

    // 输出格式，type可以指定测试信息该怎样输出
    mocha -R type


## 单进程与多进程
### 多进程
多进程如前所示，不需要额外修改


### 单进程
当需要使用单进程时，修改以下几个地方

    // 修改lib/log.js的configure方法为
    exports.configure = function(mode) {
        if (mode === "master") {
            log4js.configure(path.join(__dirname, "../config/log4js-master.json"));
        } else {
            // 单进程的配置项
            log4js.configure(path.join(__dirname, "../config/log4js.json"));
        }
    }

    // 启动worker.js，而不是master.js
    node worker.js



