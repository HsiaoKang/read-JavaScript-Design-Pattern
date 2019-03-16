// 动态创建命名空间
var MyApp = {};
MyApp.namespace = function (name) {
    var parts = name.split('.');
    var current = MyApp;
    for (var i in parts) {
        if (!current[parts[i]]) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
};
MyApp.namespace('event');
MyApp.namespace('dom.style');
console.dir(MyApp);
// 上 述 代 码 等 价 于： 
var MyApp = { event: {}, dom: { style: {} } };

// 闭包的方式
var user = (function () {
    var __name = 'sven', __age = 29;
    return {
        getUserInfo: function () {
            return __name + '-' + __age;
        }
    }
})();