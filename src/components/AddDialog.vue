<template>
    <div>
        <el-dialog title="添加笔记" :visible.sync="dialogFormVisible" center>
            <el-form :model="note" :rules="rules" ref="addForm">
                <el-form-item prop="content">
                    <el-input type="textarea" placeholder="支持markdown" v-model="note.content" autocomplete="off"
                        v-on:keydown.enter.native="submitAddNote" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
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
            };
            return {
                dialogFormVisible: false,
                note: {
                    content: "",
                    remark: "",
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
                this.$refs['addForm'].validate((valid) => {
                    if (valid) {
                        chrome.storage.sync.get({
                            q_note_setting: {
                                number: 0,
                            },
                            q_note_data: {}
                        }, function (items) {
                            _this.note.time = dayjs().format('YYYY-MM-DD HH:mm')
                            _this.note.id = items.q_note_setting.number
                            !_this.note.isHide && delete _this.note.isHide
                            items.q_note_data[_this.host] = items.q_note_data[_this.host] || []
                            items.q_note_data[_this.host].push(_this.note)
                            chrome.storage.sync.set({
                                q_note_setting: {
                                    number: items.q_note_setting.number + 1,
                                },
                                q_note_data: items.q_note_data
                            }, function () {
                                _this.hideAddNoteDialog()
                                _this.$emit('refreshData')
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