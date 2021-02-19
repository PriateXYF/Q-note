<template>
    <div>
        <el-card class="box-card">
            <div class="text item">
                导出功能暂时无法直接生成文件。
                <br />
                <br />
                请点击下面的按钮获取全部数据。
                <br />
                <br />
                你可以复制全部内容后手动保存至一个文本文件中。或者直接粘贴到导入功能的手动导入处。
                <br />
                <br />
                <el-button @click="to('/')">返回首页</el-button>
                <el-button type="primary" @click="getAllData()">导出数据</el-button>
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