<template>
    <div v-loading.fullscreen.lock="isLock" :element-loading-text="loadText">
        <el-card class="box-card">
            <div class="text item">
                你可以复制全部内容后手动保存至一个文本文件中。或者直接粘贴到导入功能的手动导入处。
                <br />
                <br />
                也可以通过将数据上传至云端进行同步。
                <br />
                <br />
                <el-button @click="$to('/')">返回首页</el-button>
                <el-button type="primary" @click="getAllData()">导出数据</el-button>
                <el-button type="success" @click="exportToCloud()">上传云端</el-button>
            </div>
        </el-card>
        <div style="margin:20px"></div>
        <el-card class="box-card">
            <el-table :data="backupHistory" stripe style="width: 100%">
                <el-table-column prop="time" label="同步时间">
                </el-table-column>
                <el-table-column prop="code" label="同步码">
                </el-table-column>
                <el-table-column prop="url" label="文件地址">
                    <template slot-scope="scope">
                        <el-button @click="$open(scope.row.url)" type="text" size="small">查看文件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deleteSyncHistoryById(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <div style="margin:20px"></div>
        <el-card class="box-card">
            {{data}}
        </el-card>
    </div>
</template>

<script>
    import AV from 'leancloud-storage';
    import dayjs from 'dayjs';
    export default {
        data() {
            return {
                isLock: false,
                data: "点击按钮导出数据",
                loadText: "正在准备上传",
                backupHistory: []
            }
        },
        methods: {
            getAllData() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_data: {}
                }, function (items) {
                    _this.data = items.q_note_data
                })
            },
            exportToCloud() {
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
                        _this.$confirm("确定将数据同步至云端？").then(() => {
                            _this.doSyncToCloud()
                        })
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
            randomString(len) {
                len = len || 8
                var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ12345678';
                var pwd = '';
                for (var i = 0; i < len; i++) {
                    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return pwd;
            },
            doSyncToCloud() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    _this.isLock = true
                    _this.loadText = "正在准备上传"
                    var setting = items.q_note_setting
                    var appId = setting.leancloud_appid
                    var appKey = setting.leancloud_appkey
                    AV.init({
                        appId,
                        appKey
                    })
                    var randomWord = _this.randomString(8)
                    const file = new AV.File(randomWord + '.json', new File([JSON.stringify(items.q_note_data)],
                        randomWord + '.json'))
                    file.save({
                        onprogress: (progress) => {
                            _this.loadText = '上传进度: ' + progress.percent + '%'
                        }
                    }).then((resfile) => {
                        _this.isLock = false
                        chrome.storage.sync.get({
                            q_note_cloud_backup: [],
                        }, function (item) {
                            _this.backupHistory = item.q_note_cloud_backup
                            _this.backupHistory.push({
                                time: dayjs().format('YYYY-MM-DD HH:mm'),
                                code: randomWord,
                                url: resfile.url(),
                                id: resfile.id,
                            })
                            _this.backupHistory.reverse()
                            chrome.storage.sync.set({
                                q_note_cloud_backup: _this.backupHistory,
                            }, function () {})
                        })
                        _this.$confirm('文件保存完成，你的同步码是【 ' + randomWord +
                            ' 】，请使用该同步码进行同步，同步码将不定期清理，请尽快使用！', '提示', {
                                confirmButtonText: '查看文件',
                                cancelButtonText: '直接关闭',
                                type: 'success'
                            }).then(() => {
                            _this.$open(resfile.url())
                        }).catch(() => {})
                    }, (error) => {
                        _this.isLock = false
                        _this.$alert('文件保存失败' + error)
                    });
                })
            },
            refreshData() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_cloud_backup: [],
                }, function (item) {
                    _this.backupHistory = item.q_note_cloud_backup
                })
            },
            deleteSyncHistoryById(id) {
                var _this = this
                this.$confirm('确定删除该条同步记录及其文件吗？', '提示', {
                    confirmButtonText: '确定！',
                    cancelButtonText: '我再想想～',
                    type: 'warning'
                }).then(() => {
                    chrome.storage.sync.get({
                        q_note_cloud_backup: [],
                    }, function (item) {
                        // const file = AV.File.createWithoutData(id);
                        // file.destroy()
                        _this.backupHistory = item.q_note_cloud_backup.filter((history) => {
                            return id !== history.id
                        })
                        chrome.storage.sync.set({
                            q_note_cloud_backup: _this.backupHistory,
                        }, function () {
                            _this.$message.success('删除成功！')
                        })

                    })
                }).catch(() => {})
            }
        },
        beforeMount() {
            this.refreshData()
        }

    }
</script>