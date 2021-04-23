<template>
    <div v-loading.fullscreen.lock="isLock">
        <el-card class="box-card">
            <div class="text item">
                导入数据会在原有的数据基础上新增数据，不会覆盖原有数据。若想覆盖原有数据请先 <el-link type="danger" @click="resetData">销毁全部数据</el-link> 。
                <br />
                <br />
                文件导入可以上传导出的 JSON/JS 文件进行导入。
                <br />
                <br />
                手动导入请手动将导出的全部内容复制粘贴到文本框进行导入。
                <br />
                <br />
                <el-button @click="$to('/')">返回首页</el-button>
                <el-button type="primary" @click="isFileImport = true">文件导入</el-button>
                <el-button type="primary" @click="isFileImport = false">手动导入</el-button>
                <el-button type="success" @click="importFromCloud">云端导入</el-button>
            </div>
        </el-card>
        <div v-show="isFileImport">
            <br />
            <br />
            <el-card class="box-card">
                <div class="text item">
                    <el-upload ref="upload" action="" :file-list="fileList" :auto-upload="false" drag
                        :on-change="handleFile" :on-remove="handleRemove" :limit='1' :on-exceed="handleFileOutLimit">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">可以上传任意json格式的文本文件哦！</div>
                    </el-upload>
                    <el-button class="import-data-button" @click="importData(import_data)" type="success"
                        v-show="hasFile">开始导入数据</el-button>
                </div>
            </el-card>
        </div>
        <br />
        <br />
        <el-card class="box-card" v-show="!isFileImport">
            <div class="text item">
                <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10}" placeholder="请粘贴导出数据"
                    v-model="import_string"></el-input>
                <el-button class="import-data-button" @click="importDataByString()" type="success"
                    v-show="import_string.length != 0">
                    开始导入数据</el-button>
            </div>
        </el-card>
    </div>
</template>

<style>
    .import-data-button {
        margin-top: 20px !important;
    }
</style>

<script>
    import AV from 'leancloud-storage';
    export default {
        data() {
            return {
                isFileImport: true,
                fileList: [],
                hasFile: false,
                import_data: {},
                import_string: "",
                isLock: false
            }
        },
        methods: {
            resetId(data, baseId) {
                baseId += 1
                for (var index in data) {
                    data[index].id = ++baseId
                }
                return data
            },
            resetData() {
                var _this = this
                this.$confirm('是否销毁全部数据？(无法恢复，请先确认是否备份)', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    chrome.storage.sync.set({
                        q_note_data: {},
                    }, function (res) {
                        _this.$message.success('数据销毁成功！');
                    })
                }).catch((e) => {
                    console.log(e)
                })
            },
            importData(import_data) {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    for (var key in import_data) {
                        items.q_note_data[key] = items.q_note_data[key] || []
                        import_data[key] = _this.resetId(import_data[key], items.q_note_setting.number)
                        items.q_note_setting.number += import_data[key].length
                        items.q_note_data[key] = items.q_note_data[key].concat(import_data[key])
                    }
                    items.q_note_setting.number = items.q_note_setting.number + 1
                    chrome.storage.sync.set({
                        q_note_setting: items.q_note_setting,
                        q_note_data: items.q_note_data
                    }, function () {
                        _this.$message.success('数据导入成功！')
                        _this.fileList = []
                        _this.import_data = {}
                        _this.import_string = ""
                    })
                })
            },
            handleFileOutLimit(file, fileList) {
                this.$message.error('只允许上传一个文件，请先清除原文件！')
            },
            handleFile(file, fileList) {
                var _this = this
                var reader = new FileReader()
                reader.readAsText(file.raw, "UTF-8")
                reader.onload = function (evt) {
                    var fileString = evt.target.result
                    var data
                    try {
                        data = JSON.parse(fileString)
                    } catch (e) {
                        _this.$message.error('读取文件出现错误，请检查json文件格式是否正确。')
                        _this.fileList = []
                        return false
                    }
                    _this.hasFile = true
                    _this.import_data = data
                }
            },
            handleRemove(file, fileList) {
                this.hasFile = false
                this.import_data = {}
            },
            importDataByString() {
                var data
                try {
                    data = JSON.parse(this.import_string)
                } catch (e) {
                    this.$message.error('json读取出现错误，请检查json格式是否正确。')
                    return false
                }
                this.importData(data)
            },
            importFromCloud() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    var setting = items.q_note_setting
                    // 如果没有设置
                    if (setting.leancloud_appid && setting.leancloud_appkey) {
                        _this.$prompt('', '请输入同步码', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /^\w{4,16}$/,
                            inputErrorMessage: '同步码格式不正确'
                        }).then(({
                            value
                        }) => {
                            _this.doSyncByCode(value)
                        }).catch((error)=>{})
                    } else {
                        _this.$confirm('还没有绑定leancloud，是否前往设置？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            _this.$to('leancloud')
                        }).catch(() => {})
                    }
                })
            },
            doSyncByCode(code) {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    _this.isLock = true
                    var setting = items.q_note_setting
                    var appId = setting.leancloud_appid
                    var appKey = setting.leancloud_appkey
                    AV.init({
                        appId,
                        appKey
                    })
                    const query = new AV.Query('_File')
                    query.equalTo('name', code.trim() + '.json')
                    query.first().then((file) => {
                        if (file) {
                            _this.$http.get(file.get('url')).then((response) => {
                                _this.isLock = false
                                var data
                                try {
                                    data = JSON.parse(JSON.stringify(response.data))
                                } catch (e) {
                                    _this.$message.error('json读取出现错误，请检查json格式是否正确。')
                                    return false
                                }
                                _this.importData(data)
                            })
                        } else {
                            _this.isLock = false
                            _this.$message.error('同步码不存在或已失效')
                        }
                    }).catch((error) => {
                        _this.isLock = false
                        _this.$message.error('查询时出现错误:' + error)
                    })
                })
            }
        }
    }
</script>