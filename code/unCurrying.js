Function.prototype.uncurrying = function () {
    var self = this
    return function () {
        var obj = Array.prototype.shift.call(arguments) // 取第一个参数 function
        return self.apply(obj, arguments)
    }
}

var push = Array.prototype.push.uncurrying();

var obj = {
    "length": 1,
    "0": 1
}

push(obj, 2)

Function.prototype.uncurrying = function () {
    var self = this;
    return function () {
        return Function.prototype.call.apply(self, arguments);
    }
};