<template>
    <div>
        <el-button class="system-data-button" @click="$to('/')">返回首页</el-button>
        <el-button class="system-data-button" @click="refreshSystemData" type="primary">刷新</el-button>
        <el-table :data="systemData" stripe style="width: 100%">
            <el-table-column prop="name" label="变量名" width="140">
            </el-table-column>
            <el-table-column prop="value" label="Value">
            </el-table-column>
        </el-table>
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
    export default {
        data() {
            return {
                systemData: []
            }
        },
        methods: {
            refreshSystemData() {
                this.systemData = []
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    for (var key in items.q_note_setting) {
                        _this.systemData.push({
                            name: key,
                            value: items.q_note_setting[key]
                        })
                    }
                })
            }
        },
        beforeMount() {
            this.refreshSystemData()
        },

    }
</script>