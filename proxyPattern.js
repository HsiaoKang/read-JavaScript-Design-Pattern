// 图片预加载代理
(function () {
    var myImage = (function () {
        var imgNode = document.createElement('img')
        document.body.appendChild(imgNode)

        return {
            setSrc(src) {
                imgNode.src = src
            }
        }
    })()


    // 引入代理
    var proxyImage = (function () {
        var img = new Image
        img.onLoad = function () {
            myImage.setSrc(this.src)
        }
        return {
            setSrc(src) {
                myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif')
                img.src = src
            }
        }
    })()

    myImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
})()
// 虚拟代理合并请求 setTimeout

// 惰性加载
var miniConsole = (function () {
    var cache = [];
    var handler = function (ev) {
        if (ev.keyCode === 113) {
            var script = document.createElement('script')
            script.onload = function () {
                for (var i = 0, fn; fn = cache[i++];) {
                    fn();
                }
            };
            script.src = 'miniConsole.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            document.body.removeEventListener('keydown', handler);  // 只 加 载 一 次 miniConsole.js
        }
    };
    document.body.addEventListener('keydown', handler, false);
    return {
        log: function () {
            var args = arguments;
            // 闭包的方式缓存
            cache.push(function () {
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})();

miniConsole.log(11); // 开 始 打 印 log 
// miniConsole.js 代 码 
miniConsole = {
    log: function () {
        // 真 正 代 码 略
        console.log(Array.prototype.join.call(arguments));
    }
};

// 代理缓存

(function () {
    var mult = function () {
        console.log('开始计算乘积')
        var a = 1
        for (var i = 0, l = arguments.length; i < l; i++) {
            a = a * arguments[i]
        }
        return a
    }

    mult(2, 3)

    // 加入代理
    var proxyMult = (function () {
        var cache = {}
        return function () {
            var args = Array.prototype.join.call(arguments, ',')
            if (args in cache) {
                return cache[args]
            }
            return cache[args] = mult.apply(this, arguments)
        }
    })()

    proxyMult(1, 2, 3, 4)
    proxyMult(1, 2, 3, 4)

    // 通过高阶函数来动态代理
    var createProxyFactory = function (fn) {
        var cache = {}; return function () {
            var args = Array.prototype.join.call(arguments, ',');
            if (args in cache) {
                return cache[args];
            } return cache[args] = fn.apply(this, arguments);
        }
    };

    var proxyMult = createProxyFactory( mult ), 

}())