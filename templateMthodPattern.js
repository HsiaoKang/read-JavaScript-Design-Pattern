var Beverage = function (param) {
    var boilWater = function () {
        console.log('把 水 煮 沸');
    };
    var brew = param.brew || function () {
        throw new Error('必 须 传 递 brew 方 法');
    };
    var pourInCup = param.pourInCup || function () {
        throw new Error('必 须 传 递 pourInCup 方 法');
    };
    var addCondiments = param.addCondiments || function () {
        throw new Error('必 须 传 递 addCondiments 方 法');
    };
    var F = function () { };
    F.prototype.init = function () {
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }
    return F;
};
var Coffee = Beverage({
    brew: function () {
        console.log('用 沸 水 冲 泡 咖 啡');
    },
    pourInCup: function () {
        console.log('把 咖 啡 倒 进 杯 子');
    },
    addCondiments: function () {
        console.log('加 糖 和 牛 奶');
    }
});
var Tea = Beverage({
    brew: function () {
        console.log('用 沸 水 浸 泡 茶 叶');
    },
    pourInCup: function () {
        console.log('把 茶 倒 进 杯 子');
    },
    addCondiments: function () {
        console.log('加 柠 檬');
    }
});
var coffee = new Coffee();
coffee.init();
var tea = new Tea();
tea.init();