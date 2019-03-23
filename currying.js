var cost = (function () {
    var args = [];
    return function () {
        if (
            arguments.length === 0) {
            var money = 0;
            for (var i = 0, l = args.length; i < l; i++) {
                money += args[i];
            }
            return money;
        }
        else {
            [].push.apply(args, arguments);
        }
    }
})();
cost(100); // 未 真 正 求 值 
cost(200); // 未 真 正 求 值 
cost(300); // 未 真 正 求 值 
console.log(cost()); // 求 值 并 输 出： 600