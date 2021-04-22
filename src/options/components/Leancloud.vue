<template>
    <div v-loading.fullscreen.lock="isLock">
        <el-button class="system-data-button" @click="$to('/')">返回首页</el-button>
        <!-- <el-button class="system-data-button" @click="" type="primary">刷新</el-button> -->
        <el-card class="box-card">
            <el-form :label-position="'top'" label-width="80px" :model="formLabelAlign">
                <el-form-item label="AppID">
                    <el-input v-model="formdata.appid"></el-input>
                </el-form-item>
                <el-form-item label="AppKey">
                    <el-input v-model="formdata.appkey"></el-input>
                </el-form-item>
                <el-form-item label="MasterKey(暂时可不填)">
                    <el-input v-model="formdata.masterkey"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="success" @click="bindLeancloud">绑定</el-button>
            <el-button @click="setDefaultLeancloud">使用系统默认</el-button>
        </el-card>
    </div>
</template>

<style>
    .system-data-button {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
        margin-right: 10px !important;
    }
</style>

<script>
    import AV from 'leancloud-storage';
    export default {
        data() {
            return {
                formdata: {
                    appid: '',
                    appkey: '',
                    masterkey: ''
                },
                isLock : false
            }
        },
        methods: {
            // 点击按钮设置默认leancloud
            setDefaultLeancloud(){
                this.formdata.appid = "ECAxQ7r2F7hm5ToXflFh0E47-MdYXbMMI"
                this.formdata.appkey = "Ut6uoEhaFugo3UzCLMu0enan"
                this.bindLeancloud()
            },
            // 点击按钮绑定leancloud
            bindLeancloud() {
                var _this = this
                this.$confirm('确定绑定该app？').then(() => {
                    _this.checkLeancloudStatue(_this.formdata.appid, _this.formdata.appkey)
                }).catch(() => {})
            },
            setLeancloud(appId, appKey) {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                }, function (items) {
                    var setting = items.q_note_setting
                    setting.leancloud_appid = appId
                    setting.leancloud_appkey = appKey
                    chrome.storage.sync.set({
                        q_note_setting: setting
                    }, function () {
                        _this.$message.success('设置APP成功！')
                    })
                })
            },
            // 检测Leancloud状态
            checkLeancloudStatue(appId, appKey) {
                if (appId.slice(-9) !== '-MdYXbMMI') {
                    this.$alert("目前仅支持 us.leancloud.cn 的app")
                } else {
                    var _this = this
                    _this.isLock = true
                    AV.init({
                        appId,
                        appKey
                    })
                    const query = new AV.Query('Notes')
                    query.limit(1)
                    query.find().then(() => {
                        _this.isLock = false
                        _this.setLeancloud(appId, appKey)
                        _this.$alert("校验成功，可以进行同步啦！")
                    }).catch((error) => {
                        _this.isLock = false
                        if (error.code == 401) {
                            _this.$alert("appId或appKey不正确，请重试")
                        } else if (error.code == 101) {
                            _this.setLeancloud(appId, appKey)
                            _this.$alert("校验成功，可以进行同步啦！")
                        } else {
                            _this.$alert("出现未知错误：" + error)
                        }
                    })
                }
            },
        },
        beforeMount() {
            var _this = this
            chrome.storage.sync.get({
                q_note_setting: {
                    number: 0,
                },
            }, function (items) {
                var setting = items.q_note_setting
                if (setting.leancloud_appid && setting.leancloud_appkey) {
                    _this.formdata.appid = setting.leancloud_appid
                    _this.formdata.appkey = setting.leancloud_appkey
                }
            })
        },

    }
</script>