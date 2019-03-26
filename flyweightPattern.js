// 享元模式
// 原来的方式
(function () {
    var id = 0;
    window.startUpload = function (uploadType, files) {
        // uploadType 区 分 是 控 件 还 是 flash
        for (var i = 0, file; file = files[i++];) {
            var uploadObj = new Upload(uploadType, file.fileName, file.fileSizefile.fileSize);
            uploadObj.init(id++); // 给 upload 对 象 设 置 一 个 唯 一 的 id 
        }
    };

    var Upload = function (uploadType, fileName, fileSize) {
        this.uploadType = uploadType; this.fileName = fileName;
        this.fileSize = fileSize; this.dom = null;
    };
    Upload.prototype.init = function (id) {
        var that = this;
        this.id = id;
        this.dom = document.createElement('div');
        this.dom.innerHTML = '< span > 文 件 名 称:' + this.fileName + ', 文 件 大 小: ' + this.fileSize + ' </ span >' + '< button class =" delFile" > 删 除 </ button >';
        this.dom.querySelector('.delFile').onclick = function () { that.delFile(); }
        document.body.appendChild(this.dom);
    };
    Upload.prototype.delFile = function () {
        if (this.fileSize < 3000) { return this.dom.parentNode.removeChild(this.dom); }
        if (window.confirm('确 定 要 删 除 该 文 件 吗? ' + this.fileName)) {
            return this.dom.parentNode.removeChild(this.dom);
        }
    };
    startUpload('plugin', [
        { fileName: '1.txt', fileSize: 1000 },
        { fileName: '2.html', fileSize: 3000 },
        { fileName: '3.txt', fileSize: 5000 }
    ])
    startUpload('flash', [
        {
            fileName: '4.txt', fileSize: 1000
        },
        {
            fileName: '5.html', fileSize: 3000
        },
        {
            fileName: '6.txt', fileSize: 5000
        }]);

}())

    // 剥离外部状态

    (function () {
        // 只保存type
        var Upload = function (uploadType) {
            this.uploadType = uploadType
        }
        Upload.prototype.delFile = function (id) {
            uploadManager.setExternalState(id, this)

            if (this.fileSize < 3000) {
                return this.dom.parentNode.removeChild(this.dom)
            }

            if (window.confirm('确定要删除该文件吗？' + this.fileName)) {
                return this.dom.parentNode.removeChild(this.dom)
            }
        }

        // 工厂进行对象实例化（单例）
        var UploadFactory = (function () {
            var createdFilWeightObjes = {}

            return {
                create: function (uploadType) {
                    if (createdFilWeightObjes[uplioadType]) {
                        return createdFilWeightObjes[uploadType]
                    }
                    return createdFilWeightObjes[uploadType] = new Upload(uploadType)
                }
            }
        })()

        // 管理器封装外部状态
        var uploadManager = (function () {
            var uploadDatabase = {}

            return {
                add: function (id, uploadType, fileName, fileSize) {
                    var flyWeightObj = UploadFactory.create(uploadType)

                    var dom = document.createElement('div')
                    dom.innerHTML =
                        '<span>文件名称：' + fileName + ',文件大小：' + fileSize + '</span>' +
                        '<button class="delFile">删除</button>'

                    dom.querySelector('. delFile').onclick = function () { flyWeightObj.delFile(id); }
                    document.body.appendChild(dom);

                    uploadDatabase[id] = { fileName: fileName, fileSize: fileSize, dom: dom };
                    return flyWeightObj;
                },
                setExternalState: function (id, flyWeightObj) {
                    var uploadData = uploadDatabase[id];
                    for (var i in uploadData) {
                        flyWeightObj[i] = uploadData[i];
                    }
                }

            }
        })()

        var id = 0; window.startUpload = function (uploadType, files) {
            for (var i = 0, file; file = files[i++];) {
                var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
            }
        };

    }())