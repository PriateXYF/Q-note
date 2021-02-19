<template>
    <div class="allcard">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-card @click.native="showAddNoteDialog" class="indexcontainer card add-note-card" shadow="hover">
                <div style="padding: 14px;">
                    <span><i class="el-icon-plus"></i></span>
                    <div class="bottom clearfix"></div>
                </div>
            </el-card>
        </el-col>
        <add-dialog ref="addDialog" :host="host" @refreshData="refreshData"></add-dialog>
    </div>
</template>

<style>
    
</style>

<script>
    import addDialog from './AddDialog'
    export default {
        props : ['host'],
        data() {
            return {
                add_dialog_is_open : false
            }
        },
        components: {
            addDialog,
        },
        methods: {
            showAddNoteDialog() {
                this.add_dialog_is_open = true
                this.$refs.addDialog.showAddNoteDialog()
            },
            hideAddNoteDialog() {
                this.add_dialog_is_open = false
                this.$refs.addDialog.hideAddNoteDialog()
            },
            refreshData(){
                this.$emit('refreshData')
            }
        },
        created() {
            // 监听快捷键
            let _this = this;
            document.onkeydown = function (e) {
                let evn = e || event;
                let key = evn.keyCode || evn.which || evn.charCode;
                // 监听 cmd + n 添加事件
                if ((evn.metaKey || evn.altKey) && key == 78) {
                    e.preventDefault()
                    _this.showAddNoteDialog()
                }else if(key == 27){
                    e.preventDefault()
                    if(_this.add_dialog_is_open){
                        _this.hideAddNoteDialog()
                    }else{
                        window.close()
                    }
                }
            }
        },
    }
</script>