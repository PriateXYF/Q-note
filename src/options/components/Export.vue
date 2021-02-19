<template>
    <div>
        <el-card class="box-card">
            <div class="text item">
                由于本人技术水平有限暂时无法直接生成json文件。
                <br />
                <br />
                请点击下面的按钮获取全部数据。
                <br />
                <br />
                复制全部内容后手动保存至一个 .json 文件中。
                <br />
                <br />
                <el-button @click="getAllData()">导出数据</el-button>
                <el-button @click="to('/')">返回首页</el-button>
            </div>
        </el-card>
        <el-card class="box-card">
            {{data}}
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                data: "点击按钮导出数据"
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
            }
        },
    }
</script>