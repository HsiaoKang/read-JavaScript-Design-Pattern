// 单例模式

// 基本示例 (存在一些问题)
(function () {

    var Singleton = function (name) {
        this.name = name
        this.instance = null
    }

    Singleton.prototype.getName = function () {
        console.log(this.name)
    }

    Singleton.getInstance = function (name) {
        // 如果存在则采用，否则创建
        if (!this.name) {
            console.log('create')
            // 这里的this指向是Singleton函数
            this.instance = new Singleton(name)
        }
        console.log(this.instance)
        return this.instance
    }

    var a = Singleton.getInstance('sven1')
    var b = Singleton.getInstance('sven2')

    console.log(a === b)        // true 这里打印时undefined，当然是true咯

    // or
    // Singleton.getInstance = (function () {
    //     var instance = null
    //     return function (name) {
    //         if (!this.name) {
    //             return new Singleton(name)
    //         }
    //         return instance
    //     }
    // }())
})()

    // 透明的单例模式

    (function () {
        var CreateDiv = (function () {
            var instance;
            var CreateDiv = function (html) {
                if (instance) {
                    return instance;
                }
                this.html = html;
                this.init();
                return instance = this;
            };
            CreateDiv.prototype.init = function () {
                var div = document.createElement('div');
                div.innerHTML = this.html;
                document.body.appendChild(div);
            };
            return CreateDiv;
        })();
        var a = new CreateDiv('sven1');
        var b = new CreateDiv('sven2');
        alert(a === b); // true

    })()

    //  通过代理实现单例模式
    (function () {
        var CreateDiv = function (html) {
            this.html = html;
            this.init();
        };

        CreateDiv.prototype.init = function () {
            var div = document.createElement('div');
            div.innerHTML = this.html;
            document.body.appendChild(div);
        };

        // 单例处理提出来
        var ProxySingletonCreateDiv = (function () {
            var instance;
            return function (html) {
                if (!instance) {
                    instance = new CreateDiv(html);
                }
                return instance;
            }
        })();

        var a = new ProxySingletonCreateDiv('sven1');
        var b = new ProxySingletonCreateDiv('sven2');
        alert(a === b);
    }())

    // 通用的惰性单例模式
    (function () {
        // 单例处理
        var getSingle = function (fn) {
            var result; return function () {
                return result || (result = fn.apply(this, arguments));
            }
        };
        // 对应的实例
        var createLoginLayer = function () {
            var div = document.createElement('div');
            div.innerHTML = '我 是 登 录 浮 窗';
            div.style.display = 'none';
            document.body.appendChild(div);
            return div;
        };
        var createSingleLoginLayer = getSingle(createLoginLayer);
        document.getElementById('loginBtn').onclick = function () {
            var loginLayer = createSingleLoginLayer();
            loginLayer.style.display = 'block';
        };

    })()