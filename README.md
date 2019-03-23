# 《JavaScript设计模式和开发实践》 阅读笔记

## 第一章 面向对象的JavaScript

### 语言类型

#### 静态类型语言

在编译时确定变量类型（编译时发现类型问题，增加定义类型的代码）

#### 动态类型语言

在程序运行时，某个变量被赋予某 个 值 之 后， 才 会 具 有 某 种 类 型。（代码数量更少，无法保证变量类型）

#### 鸭子类型

关注对象是否具有所需的特性，而不关心是否是某个类型。这样可以更轻松地额实现__面向接口编程__，而不是面向现实编程。比如一个对象具有`pop`，`push`的实现，那么就可以当作__栈__来使用。

### 多态

思想：将不变的事物和可能改变的事物分离开，书中举例是鸭子和鸡发出叫声的一个事件。将”叫“抽离成不可变的，将“怎么叫（叫声）“抽离成可能改变的部分。公共的部分之去调用这个行为就是，这个行为具体做什么则是在各自不同的部分去设定（将过程化的条件分支转换成对象的多态性，从而消除这些条件分支语句）。

现实举例：在拍摄现场，导演喊“action！”，主 角 开 始 背 台 词， 照 明 师 负 责 打 灯 光， 后 面 的 群 众 演 员 假 装 中 枪 倒 地， 道 具 师 往 镜 头 里 撒 上 雪 花。 在 得 到 同 一 个 消 息 时， 每 个 对 象 都 知 道 自 己 应 该 做 什么。 如 果 不 利 用 对 象 的 多 态 性， 而 是 用 面 向 过 程 的 方 式 来 编 写 这 一 段 代 码， 那 么 相 当 于 在 电 影 开 始 拍 摄 之 后， 导 演 每 次 都 要 走 到 每 个 人 的 面 前， 确 认 它 们 的 职 业 分 工（ 类 型）， 然 后 告 诉 他 们 要 做 什 么。

### 封装

封装是将信息隐藏，包括**数据**、**实现**、**类型**、**变化**，同时不让外界访问到并去存取的手段，目的是提供简介的API，提高安全性。

### 原型模式

 如 果 我 们 想 要 创 建 一 个 对 象， 一 种 方 法 是 先 指 定 它 的 类 型， 然 后 通 过 类 来 创 建 这 个 对 象。 

原 型 模 式 选 择 了 另 外 一 种 方 式， 我 们 不 再 关 心 对 象 的 具 体 类 型， 而 是 找 到 一 个 对 象， 然 后 通 过 克 隆 来 创 建 一 个 一 模 一 样 的 对 象。因为在语言层面就提供了`clone`的方法，所以在JavaScript中原型模式也是语言的一种编程范式。

实现重点：通过Object.create 来克隆一个相同的实例。

注意：create出来的对象在没有自身的属性时，是直接引用的原型对象，所以当原型对象改变后，clone对象的属性值也会变化。

过程：创建原型=>创建实例=>克隆实例

JavaScript 的整个对象系统都是建立在原型模式上的，在JavaScript中更多体现的是一种**编程范式**,原型和对象之间存在一种委托关系，对象自身不存在的属性通过原型链委托到原型对象上。

### 总结

这一章的内容其实主要是在描述**面向对象编程**的四种特性__多态性__，__封装性__，__继承性__，__抽象性__。以及在JavaScritpt中__原型模式__的原理和实现。



## 第二章 this、call 和 apply

### this

this总是指向一个上下文对象，具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数声明时的环境。

#### 指向

除去不常用的`with`和`eval`情况，大致分下面四种。

- 作为对象的方法调用（对象）
- 作为普通函数函数调用（window || 严格模式undefined，可以用变量保存this）
- 构造器调用（指向隐式返回的对象）
- Function.prototype.call 和 Function.prototype.apply 调用（改变this指向）

### apply 和 call

第一个参数均是预期指向的目标对象，传`null`则是指向默认的宿主window

后面参数有所不同，`apply`是一个数组格式的集合，`call`是包装`apply`的语法糖，可以明确的表现出形参和实参的对应关系。

除了改变 this 的指向，call 和 apply 还能在目标参数上调用其他其他类型的方法，此时第一个参数传`null`

举例有: 操作arguments的时候，可以考虑使用Array的的方法。

### bind

绑定函数的this指向，且后面无法再次bind

### 优先级

new > bind()/call/apply > 隐式 > 默认

## 第三章 闭包和高阶函数

这些特性属于函数式编程语言

### 闭包

闭包的形成和变量的**作用域**以及变量的**生存周期**密切相关。

#### 变量的作用域

指变量在代码中的有效范围，比如没有使用 `var`关键字就会声明一个全局的变量。

#### 变量的生存周期

全局的变量是永久的，除非主动销毁，函数内的变量则会随着函数调用的结束被销毁

```javascript
var func = function () {
    var a = 1;
    return function () {
        a ++;
        alert(a);
    }
};
var f = func();
f(); // 输 出： 2 
f(); // 输 出： 3 
f(); // 输 出： 4 
f(); // 输 出： 5
```

**一个函数的变量在其他作用域中被引用了，那么这个变量就不会被销毁，于是形成了闭包的结构**

避免内存泄漏可以在不用的时候将引用设为 `null`。

### 高阶函数

满足一下条件之一：

- 函数可以作为参数传递（回调函数）
- 函数可以作为返回值输出（函数增强）

高阶函数可以实现AOP、柯里化（currying）uncurrying、函数节流（resize等事件、上传进度扫描频率）、惰性加载。

## 第四章 单例模式

### 定义

保证一个类只有一个实例，并提供一个它的全局访问点。

### 实现

#### 简单的实例

```javascript
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
```

#### 透明的单例模式

```
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
```

#### 通过代理实现单例模式

```javascript
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
```



在Javascript中其实没有必要非得用“类”的概念来实现单例模式，只需要将实例保存到变量中即可（这时候涉及到一个全局变量问题，同样可以通过命名空间或者闭包来解决）。

#### 惰性单例

有对应操作的时候再来创建。

### 小结

单例模式，在只需要一个实例的情况下，避免重复创建。

实例保存在合理的作用域内，这里可以用闭包来实现，并涉及到单一职责原则。

可以在需要用到的时候才去创建这个实例，避免浪费。

## 第五章 策略模式

### 定义

定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。策略模式体现在算法的使用和算法的实现分开（将不变的部分和变化的部分分隔开，这同样是也是多态的一种体现）

### 实现

```javascript
var strategies = {
    "S": function (salary) {
        return salary * 4;
    },
    "A": function (salary) {
        return salary * 3;
    },
    "B": function (salary) {
        return salary * 2;
    }
}; var calculateBonus = function (level, salary) {
    return strategies[level](salary);
};
console.log(calculateBonus('S', 20000)); // 输 出： 80000 
console.log( calculateBonus( 'A', 10000 ) ); // 输 出： 30000
```

### 优缺点

利用组合、委托和多态等技术和思想，避免了多重条件分支语句

支持了开放-封闭原则，策略组可以单独的进行扩展

策略满足单一职责的原则，可以很好的复用。

会创建新的策略对象。

使用的时候需要了解所有策略，违反最少知识原则。

### 小结

策略模式是结合了多种设计原则来实现的，在需要多种方案分别处理事务时可以考虑使用；在JavaScript中，策略模式可以通过将对象的值作为函数的方式来实现，不必再通过定义类的方式。

## 第六章 代理模式

### 定义

为一个对象提供一个代用品或占位符，以便控制对它的访问。

**保护代理**：过滤掉不满足要求的请求，控制权限。

**虚拟代理**：在合适的时间才执行请求。

主要讲虚拟代理，场景有图片预加载（先放loading，内容处理完成后替换掉）

### 意义

代理的意义在于帮助实现了面向对象设计中——单一职责原则，而坚持单一职责的原则可以让代码拆分的更加细粒度，更有利于维护，这个其实是相当于用代码量换来**稳定性**和**可维护性**

### 实现

代理和本体需要实现同一个`接口`,保证代理的兼容性，在JavaScript（或者其他动态类型语言）中则可以选择是做检查还是依靠程序员的自觉性。

```javascript
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
var proxyImage = (function(){
    var img = new Image
    img.onLoad = function(){
        myImage.setSrc(this.src)
    }
    return {
        setSrc(src){
            myImage.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif')
            img.src = src
        }
    }
})()

myImage.setSrc('http://imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');

```

### 场景

图片预加载、合并重复请求、缓存代理（缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前一致，则可以直接返回前面存储的运算结果。）

还有些其他的：防火墙代理，远程代理，保护代理，智能引用代理，写时复制代理。

代理可以在实际需要的时候再去编写，JavaScript中最多的是虚拟代理和缓存代理。



## 第七章 迭代器模式

提供一种方法顺序访问一个聚合对象中的各个元素，又不暴露该对象的内部表示。迭代器分为内部迭代器和外部迭代器。

**内部迭代器**：方法内部完成整个迭代过程。

**外部迭代器**：在外部显式的请求迭代下一个元素。

### 场景

多个if语句的情况下，可以将条件进行迭代，找到合适的分支。



## 第八章 发布——订阅模式（观察者模式）

浏览器中的事件监听就是其中一种。

### 实现

指定发布者

建立通知列表

遍历列表，触发通知。

```javascript
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
```



### 场景

#### 先发布，后订阅（离线消息）

为 了 满 足 这 个 需 求， 我 们 要 建 立 一 个 存 放 离 线 事 件 的 堆 栈， 当 事 件 发 布 的 时 候， 如 果 此 时 还 没 有 订 阅 者 来 订 阅 这 个 事 件， 我 们 暂 时 把 发 布 事 件 的 动 作 包 裹 在 一 个 函 数 里， 这 些 包 装 函 数 将 被 存 入 堆 栈 中， 等 到 终 于 有 对 象 来 订 阅 此 事 件 的 时 候， 我 们 将 遍 历 堆 栈 并 且 依 次 执 行 这 些 包 装 函 数， 也 就 是 重 新 发 布 里 面 的 事 件。 当 然 离 线 事 件 的 生 命 周 期 只 有 一 次， 就 像 QQ 的 未 读 消 息 只 会 被 重 新 阅 读 一 次， 所 以 刚 才 的 操 作 我 们 只 能 进 行 一 次。

#### 命名空间

```javascript&#39;
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
```

### 小结

发布——订阅模式在时间和对象之间做了解耦，可以帮助实现其他模式，如中介者模式。但是创建订阅者会消耗内存，即使没有发生消息，但是订阅者一直存在。过度使用的话也会弱化对象间的联系，不容易定位bug

## 第九章 命令模式

### 用途

可以用来消除信息发送者和信息接收者之间的耦合关系。这中间交给命令列表，命令模式支持延时、撤销、排队等操作。

### 设计

JavaScript中函数作为一等公民，可以直接将函数作为命令来传递。这些命令存放在一个列表。撤销和重做功能可以基于这个列表来实现。宏命令则是提供了一个触发器，来批量执行任务。

智能命令和傻瓜命令的区别就是智能命令不再需要通过执行器来执行命令，实现方式上和策略模式一样。

Javascript中可以用高阶函数的方式来实现命令模式，所以这个模式在Javascript中是隐形的。

### 示例

```javascript
var Ryu = {
    attack: function () {
        console.log('攻 击');
    },
    defense: function () {
        console.log('防 御');
    },
    jump: function () {
        console.log('跳 跃');
    },
    crouch: function () {
        console.log('蹲 下');
    }
}; var makeCommand = function (receiver, state) {
    // 创 建 命 令 
    return function () {
        receiver[state]();
    }
};
var commands = {
    "119": "jump", // W 
    "115": "crouch", // S
    "97": "defense", // A
    "100": "attack" // D
};
var commandStack = []; // 保 存 命 令 的 堆 栈 
document.onkeypress = function (ev) {
    var keyCode = ev.keyCode,
        command = makeCommand(Ryu, commands[keyCode]);
    if (command) {
        command(); // 执 行 命 令 
        commandStack.push(command); // 将 刚 刚 执 行 过 的 命 令 保 存 进 堆 栈 
    }
};
document.getElementById('replay').onclick = function () {
    // 点 击 播 放 录 像 
    var command;
    while (command = commandStack.shift()) {
        // 从 堆 栈 里 依 次 取 出 命 令 并 执 行 
        command();
    }
};
```

## 第十章 组合模式

表示树形结构

利用对象的多态性同意对待组合对象和单一对象。

请求在整个树结构中逐步传递。

### 示例

文件系统

```javascript
/******************************* Folder ******************************/
var Folder = function (name) {
    this.name = name;
    this.files = [];
};
Folder.prototype.add = function (file) {
    this.files.push(file);
};
Folder.prototype.scan = function () {
    console.log('开 始 扫 描 文 件 夹: ' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];) {
        file.scan();
    }
};
/******************************* File ******************************/
var File = function (name) { this.name = name; };
File.prototype.add = function () {
    throw new Error('文 件 下 面 不 能 再 添 加 文 件');
};
File.prototype.scan = function () {
    console.log('开 始 扫 描 文 件: ' + this.name);
};

// 添加一些文件和文件夹
var folder = new Folder('学 习 资 料');
var folder1 = new Folder('JavaScript');
var folder2 = new Folder('jQuery');
var file1 = new File('JavaScript 设 计 模 式 与 开 发 实 践');
var file2 = new File('精 通 jQuery');
var file3 = new File('重 构 与 模 式')
folder1.add(file1);
folder2.add(file2);
folder.add(folder1);
folder.add(folder2);
folder.add(file3);



// 拷贝
var folder3 = new Folder('Nodejs');
var file4 = new File('深 入 浅 出 Node.js');
folder3.add(file4);
var file5 = new File('JavaScript 语 言 精 髓 与 编 程 实 践');

// 粘贴
folder.add(folder3);
folder.add(file5);

// 扫描整个树
folder.scan();
```

通过冒泡来删除

```javascript
   var Folder = function (name) {
        this.name = name; this.parent = null;
        // 增 加 this.parent 属 性
        this.files = [];
    }; Folder.prototype.add = function (file) {
        file.parent = this;
        // 设 置 父 对 象
        this.files.push(file);
    }; Folder.prototype.scan = function () {
        console.log('开 始 扫 描 文 件 夹: ' + this.name);
        for (var i = 0, file, files = this.files; file = files[i++];) { file.scan(); }
    };
    Folder.prototype.remove = function () {
        if (!this.parent) {
            // 根 节 点 或 者 树 外 的 游 离 节 点 
            return;
        } for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
            var file = files[l]; if (file === this) { files.splice(l, 1); }
        }
    };
    // file
    var File = function (name) { this.name = name; this.parent = null; };
    File.prototype.add = function () { throw new Error('不 能 添 加 在 文 件 下 面'); };
    File.prototype.scan = function () { console.log('开 始 扫 描 文 件: ' + this.name); };
    File.prototype.remove = function () {
        if (!this.parent) {
            // 根 节 点 或 者 树 外 的 游 离 节 点
            return;
        } for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
            var file = files[l]; if (file === this) { files.splice(l, 1); }
        }
    };
```



### 注意点

组合模式不是父子关系，是聚合（has-a），重点是这些组成元素都有相同的接口（即使具体功能不一样，但是可以统一调用）

如果同一个元素处于多个组下，那么可能会造成重复的操作，这是可以引入中介者模式来管理

树太庞大时，遍历整个树消耗很大，这时候可以引入职责链模式。

### 使用场景

用来表示对象的部分-整体的结构

需要统一对待树中的所有对象。

