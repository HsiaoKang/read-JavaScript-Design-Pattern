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
