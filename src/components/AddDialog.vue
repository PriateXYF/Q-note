<template>
    <div>
        <el-dialog title="添加笔记" :visible.sync="dialogFormVisible" center>
            <el-form :model="note">
                <el-form-item>
                    <el-input type="textarea" placeholder="支持markdown" v-model="note.content" autocomplete="off"
                        v-on:keydown.enter.native="submitAddNote"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="note.isHide">隐藏文本</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="备注，可不填，不会被隐藏" v-model="note.remark" autocomplete="off"
                        v-on:keydown.enter.native="submitAddNote"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addNote">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    export default {
        props : ['host'],
        data() {
            return {
                dialogFormVisible: false,
                note: {
                    content: "",
                    remark: "",
                    isHide: false
                },
            }
        },
        methods: {
            showAddNoteDialog() {
                this.dialogFormVisible = true
            },
            hideAddNoteDialog() {
                this.dialogFormVisible = false
                this.note = {
                    content: "",
                    remark: "",
                    isHide: false
                }
            },
            submitAddNote(e) {
                if (e.metaKey) {
                    this.addNote()
                }
            },
            addNote() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: []
                }, function (items) {
                    _this.note.time = dayjs().format('YY-MM-DD HH:mm')
                    _this.note.id = items.q_note_setting.number
                    _this.note.host = _this.host
                    items.q_note_data.push(_this.note)
                    chrome.storage.sync.set({
                        q_note_setting: {
                            number: items.q_note_setting.number + 1,
                        },
                        q_note_data: items.q_note_data
                    }, function () {
                        _this.hideAddNoteDialog()
                        console.log(items)
                        _this.$emit('refreshData')
                        // 此处需处理逻辑
                        // _this.$refs.card.refreshData()
                    })
                })
            },
        },
    }
</script>