// 迭代器模式

var Iterator = function (obj) {
    var current = 0
    var next = function () {
        current += 1
    }
    var isDone = function () {
        return current >= obj.length
    }
    var getCurrItem = function () {
        return obj[current]
    }
    return { next: next, isDone: isDone, getCurrItem: getCurrItem }
}

// 倒叙迭代器
var reverseEach = function (ary, callback) {
    for (var l = ary.length - 1; l >= 0; l--) {
        callback(l, ary[l]);
    }
};
reverseEach([0, 1, 2], function (i, n) {
    console.log(n); // 分 别 输 出： 2, 1 ,0 
});

// 终止迭代器
// 可以设定一个触发条件，在迭代的过程中终止。