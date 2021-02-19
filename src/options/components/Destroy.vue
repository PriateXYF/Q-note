<template>
    <div>
    </div>
</template>

<script>
    export default {
        methods: {
            resetData() {
                var _this = this
                chrome.storage.sync.set({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (res) {
                    _this.$message.success('数据销毁成功！已重置为初始状态。');
                })
            },
        },
        mounted() {
            this.$confirm('是否销毁全部数据？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.resetData()
            })
            this.$router.push('/')
            
        },
    }
</script>