<template>
    <div>
        <el-dialog title="修改笔记" :visible.sync="dialogFormVisible" center>
            <el-form :model="note" :rules="rules" ref="modifyForm">
                <el-form-item prop="content">
                    <el-input type="textarea" placeholder="支持markdown" v-model="note.content" autocomplete="off"
                        v-on:keydown.enter.native="submitModifyNote"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="note.isHide">隐藏文本</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-input placeholder="备注，可不填，不会被隐藏" v-model="note.remark" autocomplete="off"
                        v-on:keydown.enter.native="submitModifyNote"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyNote">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import dayjs from 'dayjs'
    export default {
        props: ['host'],
        data() {
            var validateContent = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请填写笔记内容'));
                } else if (value.indexOf('|') >= 0) {
                    callback(new Error('为确保顺利导出数据，请不要使用"|"字符'));
                } else {
                    callback();
                }
            }
            return {
                dialogFormVisible: false,
                note: {
                    content: "",
                    isHide: false
                },
                rules: {
                    content: [{
                        validator: validateContent,
                    }]
                }
            }
        },
        methods: {
            showModifyNoteDialog(item) {
                this.note = item
                this.dialogFormVisible = true
            },
            hideModifyNoteDialog() {
                this.dialogFormVisible = false
                this.note = {
                    content: "",
                    remark: "",
                    isHide: false
                }
            },
            submitModifyNote(e) {
                if (e.metaKey) {
                    this.modifyNote()
                }
            },
            modifyNote() {
                var _this = this
                this.$refs['modifyForm'].validate((valid) => {
                    if (valid) {
                        chrome.storage.sync.get({
                            q_note_setting: {
                                number: 0,
                            },
                            q_note_data: {}
                        }, function (items) {
                            _this.note.time = dayjs().format('YYYY-MM-DD HH:mm')
                            delete _this.note.isShow
                            !_this.note.isHide && delete _this.note.isHide
                            for (var index in items.q_note_data[_this.host]) {
                                if (items.q_note_data[_this.host][index].id == _this.note.id) {
                                    items.q_note_data[_this.host][index] = _this.note
                                    break
                                }
                            }
                            chrome.storage.sync.set({
                                q_note_data: items.q_note_data
                            }, function () {
                                _this.$emit('refreshData')
                                _this.hideModifyNoteDialog()
                            })
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        },
    }
</script>