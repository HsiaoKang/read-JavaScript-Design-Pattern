// 职责链模式
(function () {

    // 常规逻辑分支
    var order = function (orderType, pay, stock) {
        if (orderType === 1) {
            // 500 元 定 金 购 买 模 式 
            if (pay === true) {
                // 已 支 付 定 金 
                console.log('500 元 定 金 预 购, 得 到 100 优 惠 券');
            }
            else {
                // 未 支 付 定 金， 降 级 到 普 通 购 买 模 式 
                if (stock > 0) {
                    // 用 于 普 通 购 买 的 手 机 还 有 库 存 
                    console.log('普 通 购 买, 无 优 惠 券');
                }
                else { console.log('手 机 库 存 不 足'); }
            }
        }
        else if (orderType === 2) {
            // 200 元 定 金 购 买 模 式 
            if (pay === true) { console.log('200 元 定 金 预 购, 得 到 50 优 惠 券'); }
            else {
                if (stock > 0) {
                    console.log('普 通 购 买, 无 优 惠 券');
                }
                else { console.log('手 机 库 存 不 足'); }
            }
        }
        else if (orderType === 3) {
            if (stock > 0) { console.log('普 通 购 买, 无 优 惠 券'); }
            else { console.log('手 机 库 存 不 足'); }
        }
    };
    order(1, true, 500); // 输 出： 500 元 定 金 预 购, 得 到 100 优 惠 券
})()


    // 使用职责链模式
    (function () {
        // 500 元 订 单 
        var order500 = function (orderType, pay, stock) {
            if (orderType === 1 && pay === true) {
                console.log('500 元 定 金 预 购, 得 到 100 优 惠 券');
            } else {
                order200(orderType, pay, stock); // 将 请 求 传 递 给 200 元 订 单
            }
        };

        // 200 元 订 单 
        var order200 = function (orderType, pay, stock) {
            if (orderType === 2 && pay === true) {
                console.log('200 元 定 金 预 购, 得 到 50 优 惠 券');
            }
            else {
                orderNormal(orderType, pay, stock); // 将 请 求 传 递 给 普 通 订 单
            }
        };

        // 普 通 购 买 订 单 
        var orderNormal = function (orderType, pay, stock) {
            if (stock > 0) { console.log('普 通 购 买, 无 优 惠 券'); }
            else { console.log('手 机 库 存 不 足'); }
        };

        // 测 试 结 果： 
        order500(1, true, 500); // 输 出： 500 元 定 金 预 购, 得 到 100 优 惠 券 
        order500(1, false, 500); // 输 出： 普 通 购 买, 无 优 惠 券 
        order500(2, true, 500); // 输 出： 200 元 定 金 预 购, 得 到 50 优 惠 券 
        order500(3, false, 500); // 输 出： 普 通 购 买, 无 优 惠 券 
        order500(3, false, 0); // 输 出： 手 机 库 存 不 足

    })()


    // 进一步优化
    (function () {
        var order500 = function (orderType, pay, stock) {
            if (orderType === 1 && pay === true) {
                console.log('500 元 定 金 预 购， 得 到 100 优 惠 券');
            }
            else {
                return 'nextSuccessor'; // 我 不 知 道 下 一 个 节 点 是 谁， 反 正 把 请 求 往 后 面 传 递 
            }
        };
        var order200 = function (orderType, pay, stock) {
            if (orderType === 2 && pay === true) {
                console.log('200 元 定 金 预 购， 得 到 50 优 惠 券');
            }
            else {
                return 'nextSuccessor'; // 我 不 知 道 下 一 个 节 点 是 谁， 反 正 把 请 求 往 后 面 传 递
            }
        };
        var orderNormal = function (orderType, pay, stock) {
            if (stock > 0) {
                console.log('普 通 购 买， 无 优 惠 券');
            } else { console.log('手 机 库 存 不 足'); }
        };


        // Chain.prototype.setNextSuccessor 指 定 在 链 中 的 下 一 个 节 点 
        // Chain.prototype.passRequest 传 递 请 求 给 某 个 节 点 
        var Chain = function (fn) {
            this.fn = fn; this.successor = null;
        };
        Chain.prototype.setNextSuccessor = function (successor) {
            return this.successor = successor;
        };
        Chain.prototype.passRequest = function () {
            var ret = this.fn.apply(this, arguments);
            if (ret === 'nextSuccessor') {
                return this.successor && this.successor.passRequest.apply(this.successor, arguments);
            }
            return ret;
        };


        // 包装节点
        var chainOrder500 = new Chain(order500);
        var chainOrder200 = new Chain(order200);
        var chainOrderNormal = new Chain(orderNormal);

        // 顺序
        chainOrder500.setNextSuccessor(chainOrder200);
        chainOrder200.setNextSuccessor(chainOrderNormal);

        chainOrder500.passRequest(1, true, 500); // 输 出： 500 元 定 金 预 购， 得 到 100 优 惠 券 
        chainOrder500.passRequest(2, true, 500); // 输 出： 200 元 定 金 预 购， 得 到 50 优 惠 券 
        chainOrder500.passRequest(3, true, 500); // 输 出： 普 通 购 买， 无 优 惠 券 
        chainOrder500.passRequest(1, false, 0); // 输 出： 手 机 库 存 不 足

        // 灵活添加其他
        var order300 = function () {
            // 具 体 实 现 略 
        };
        chainOrder300 = new Chain(order300);
        chainOrder500.setNextSuccessor(chainOrder300);
        chainOrder300.setNextSuccessor(chainOrder200);


        // 异步的职责链
        Chain.prototype.next = function () {
            return this.successor && this.successor.passRequest.apply(this.successor, arguments);
        };
        var fn1 = new Chain(function () {
            console.log(1); return 'nextSuccessor';
        });
        var fn2 = new Chain(function () {
            console.log(2);
            var self = this; setTimeout(function () {
                self.next();
            }, 1000);
        });
        var fn3 = new Chain(function () {
            console.log(3);
        });
        fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
        fn1.passRequest();

    })()


    // 用AOP的方式
    (function () {
        Function.prototype.after = function (fn) {
            var self = this; return function () {
                var ret = self.apply(this, arguments);
                if (ret === 'nextSuccessor') {
                    return fn.apply(this, arguments);
                } return ret;
            }
        };
        var order = order500yuan.after(order200yuan).after(orderNormal);
        order(1, true, 500); // 输 出： 500 元 定 金 预 购， 得 到 100 优 惠 券
        order(2, true, 500); // 输 出： 200 元 定 金 预 购， 得 到 50 优 惠 券 
        order(1, false, 500); // 输 出： 普 通 购 买， 无 优 惠 券

    }())