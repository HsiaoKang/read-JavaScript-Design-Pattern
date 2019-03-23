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

// 保存父对象
(function () {
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
    File.prototype.add = function () {
        throw new Error('不 能 添 加 在 文 件 下 面');
    };
    File.prototype.scan = function () {
        console.log('开 始 扫 描 文 件: ' + this.name);
    };
    File.prototype.remove = function () {
        if (!this.parent) {
            // 根 节 点 或 者 树 外 的 游 离 节 点
            return;
        } for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
            var file = files[l]; if (file === this) { files.splice(l, 1); }
        }
    };



}())