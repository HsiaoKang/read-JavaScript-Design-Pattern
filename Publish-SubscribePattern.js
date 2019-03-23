// 发布-订阅模式
var salsesOffices = {}

salsesOffices.clientList = []

salsesOffices.listen = function (fn) {
    this.clientList.push(fn)
}

salsesOffices.trigger = function () {
    for (var i = 0, fn; fn = this.clientList[i++];) {
        fn.apply(this, arguments)
    }
}

// 动态添加订阅

var event = {
    clientList: [],
    listen: function (key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = []
        }
        this.clientList[key].push(fn)
    },
    trigger: function () {
        var key = Array.prototype.shift.call(arguments),
            fns = this.clientList[key]
        if (!fns || fns.length === 0) {
            return false
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments)
        }
    }
}
// 将事件写道目标对象上
var installEvent = function (obj) {
    for (var i in event) {
        obj[i] = event[i];
    }
};

event.remove = function (key, fn) {
    var fns = this.clientList[key];
    if (!fns) {
        // 如 果 key 对 应 的 消 息 没 有 被 人 订 阅， 则 直 接 返 回 
        return false;
    } if (!fn) {
        // 如 果 没 有 传 入 具 体 的 回 调 函 数， 表 示 需 要 取 消 key 对 应 消 息 的 所 有 订 阅
        fns && (fns.length = 0);
    }
    else {
        for (var l = fns.length - 1; l >= 0; l--) {
            // 反 向 遍 历 订 阅 的 回 调 函 数 列 表 
            var _fn = fns[l]; if (_fn === fn) {
                fns.splice(l, 1);// 删 除 订 阅 者 的 回 调 函 数 
            }
        }
    }
};


// 避免给每一个发布者都添加方法
(function () {
    var Event = (function () {
        var clientList = {}, listen, trigger, remove
        listen = function (key, fn) {
            if (!clientList[key]) {
                clientList[key] = []
            } clientList[key].push(fn)
        }
        trigger = function () {
            var key = Array.prototype.shift.call(arguments), fns = clientList[key]
            if (!fns || fns.length === 0) {
                return false
            }
            for (var i = 0, fn; fn = fns[i++];) {
                fn.apply(this, arguments)
            }
        }
        remove = function (key, fn) {
            var fns = clientList[key]
            if (!fns) {
                return false
            } if (!fn) {
                fns && (fns.length = 0)

            } else {
                for (var l = fns.length - 1; l >= 0; l--) {
                    var _fn = fns[l]
                    if (_fn === fn) {
                        fns.splice(l, 1)
                    }
                }
            }
        }
        return { listen: listen, trigger: trigger, remove: remove }
    }())

    Event.listen('squareMeter88', function (price) {
        // 小 红 订 阅 消 息 
        console.log('价 格 = ' + price)
        // 输 出：' 价 格 = 2000000'
    })
    Event.trigger('squareMeter88', 2000000)    // 售 楼 处 发 布 消 息

}())

    (function () {
        var Event = (function () {
            var global = this, Event,
                _default = 'default';
            Event = function () {
                var _listen,
                    _trigger,
                    _remove,
                    _slice = Array.prototype.slice,
                    _shift = Array.prototype.shift,
                    _unshift = Array.prototype.unshift,
                    namespaceCache = {},
                    _create,
                    find,
                    each = function (ary, fn) {
                        var ret;
                        for (var i = 0, l = ary.length; i < l; i++) {
                            var n = ary[i];
                            ret = fn.call(n, i, n);
                        }
                        return ret;
                    };
                _listen = function (key, fn, cache) {
                    if (!cache[key]) {
                        cache[key] = [];
                    } cache[key].push(fn);
                };
                _remove = function (key, cache, fn) {
                    if (cache[key]) {
                        if (fn) {
                            for (var i = cache[key].length; i >= 0; i--) {
                                if (cache[key][i] === fn) {
                                    cache[key].splice(i, 1);
                                }
                            }
                        } else {
                            cache[key] = [];
                        }
                    }
                };
                _trigger = function () {
                    var cache = _shift.call(arguments),
                        key = _shift.call(arguments),
                        args = arguments,
                        _self = this,
                        ret,
                        stack = cache[key];
                    if (!stack || !stack.length) {
                        return;
                    }
                    return each(stack, function () {
                        return this.apply(_self, args);
                    });
                };
                _create = function (namespace) {
                    var namespace = namespace || _default;
                    var cache = {},
                        offlineStack = [], // 离 线 事 件 
                        ret = {
                            listen: function (key, fn, last) {
                                _listen(key, fn, cache); if (offlineStack === null) { return; }
                                if (last === 'last') {
                                    offlineStack.length && offlineStack.pop()();
                                } else {
                                    each(offlineStack, function () { this(); });
                                } offlineStack = null;
                            },
                            one: function (key, fn, last) {
                                _remove(key, cache);
                                this.listen(key, fn, last);
                            },
                            remove: function (key, fn) {
                                _remove(key, cache, fn);
                            },
                            trigger: function () {
                                var fn,
                                    args,
                                    _self = this;
                                _unshift.call(arguments, cache);
                                args = arguments; fn = function () {
                                    return _trigger.apply(_self, args);
                                };
                                if (offlineStack) {
                                    return offlineStack.push(fn);
                                }
                                return fn();
                            }
                        };
                    return namespace ? (namespaceCache[namespace] ? namespaceCache[namespace] : namespaceCache[namespace] = ret) : ret;
                }; return {
                    create: _create, one: function (key, fn, last) {
                        var event = this.create(); event.one(key, fn, last);
                    },
                    remove: function (key, fn) {
                        var event = this.create();
                        event.remove(key, fn);
                    }, listen: function (key, fn, last) {
                        var event = this.create(); event.listen(key, fn, last);
                    },
                    trigger: function () {
                        var event = this.create();
                        event.trigger.apply(this, arguments);
                    }
                };
            }(); return Event;
        })();
    })()