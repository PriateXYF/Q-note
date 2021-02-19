<template>
    <div>
        <el-row class="allcard">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in data" :key="index">
                <el-card class="indexcontainer card" shadow="hover">
                    <div slot="header" class="clearfix">
                        <template>
                            <el-popconfirm title="确定删除该笔记？" @confirm="deleteNote(item)">
                                <!-- @click="" -->
                                <span slot="reference" class="card-close-button"><i
                                        class="el-icon-circle-close"></i></span>
                            </el-popconfirm>
                        </template>

                        <el-tooltip class="item" effect="dark" :content="copyTip" placement="top">
                            <span @click="copyContent(item)" class="card-button"><i
                                    :class="item.copyIcon || 'el-icon-copy-document'"></i></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="item.isShow ? '隐藏' : '查看'" placement="top">
                            <span class="card-button" @click="switchContent(item)"><i
                                    :class="item.isShow ? 'el-icon-remove' : 'el-icon-view'"></i></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="修改" placement="top">
                            <span class="card-button" @click="modifyNote(item)"><i class="el-icon-edit"></i></span>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" :content="item.isLike ? '移出收藏' : '加入收藏'" placement="top">
                            <span class="card-button" @click="switchLike(item)"><i
                                    :class="item.isLike ? 'el-icon-star-on' : 'el-icon-star-off'"></i></span>
                        </el-tooltip>
                    </div>
                    <div style="padding: 14px;">
                        <span v-show="!item.isShow" class="card-lock-button"><i class="el-icon-lock"></i></span>
                        <span v-show="item.isShow" v-html="marked(item.content)"></span>
                        <div class="bottom clearfix">
                            <div class="desc">{{item.time}}</div>
                        </div>
                    </div>
                    <div class="card-remark" v-show="item.remark">备注:{{item.remark}}</div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
                <el-card @click.native="showAddNoteDialog" class="indexcontainer card add-note-card" shadow="hover">
                    <div style="padding: 14px;">
                        <span><i class="el-icon-plus"></i></span>
                        <div class="bottom clearfix"></div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style>
    .card-remark {
        color: gray;
        font-size: 10px;
    }

    .card p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-block-start: 0em;
        margin-block-end: 0.5em;
    }

    .card a {
        text-decoration: none;
    }

    .add-note-card {
        cursor: pointer;
    }

    .card-button {
        cursor: pointer;
        float: left;
        margin: 10px;
        font-size: 20px;
    }

    .card-close-button {
        cursor: pointer;
        float: right;
        margin: 10px;
        font-size: 20px;
        color: pink;
    }

    .card-button:hover {
        color: yellowgreen;
        transition: color 0.5s;
    }

    .card-close-button:hover {
        color: red;
        transition: color 0.5s;
    }

    .allcard {
        margin: 20px;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .el-card__header {
        padding: 0 !important;
    }

    .card {
        margin-bottom: 10px;
        /* width: 100%; */
        background-size: cover !important;
        font-size: 20px;
    }

    /* .card span{
    max-width: 200px;
    word-wrap : break-word;
  } */
    .el-card__body {
        max-width: 100%;
        word-wrap: break-word;
    }

    .bottom {
        margin-top: 13px;
        font-size: 16px;
        line-height: 12px;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }
</style>

<script>
    import marked from 'marked'
    export default {
        props: ['host'],
        data() {
            return {
                copyTip: '复制',
                data: [],
                marked: marked,
            }
        },
        methods: {
            async copyContent(item) {
                try {
                    var text = item.content.replace(/<\/?[^>]*>/g, ' ').replace(/&nbsp;/ig, ' ')
                    // msg = msg.replace(/[|]*\n/, '')
                    await navigator.clipboard.writeText(text);
                    this.copyTip = '已复制'
                    item.copyIcon = 'el-icon-check'
                    var _this = this
                    setTimeout(function () {
                        _this.copyTip = '复制'
                        item.copyIcon = 'el-icon-copy-document'
                    }, 500)
                } catch (err) {
                    this.$message.error('复制失败')
                }
            },
            switchContent(item) {
                for (var index in this.data) {
                    if (item.id == this.data[index].id) {
                        this.$set(this.data[index], "isShow", !item.isShow);
                        break
                    }
                }
                this.data = Object.assign({}, this.data)
            },
            deleteNote(item) {
                var _this = this
                chrome.storage.sync.get({
                    q_note_data: {}
                }, function (items) {
                    const new_data = items.q_note_data[_this.host].filter((note) => note.id != item.id)
                    items.q_note_data[_this.host] = new_data
                    chrome.storage.sync.set({
                        q_note_data: items.q_note_data
                    }, function () {
                        _this.refreshData()
                    })
                })
            },
            showAddNoteDialog() {
                this.$emit('showAddNoteDialog')
            },
            refreshData() {
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    items.q_note_data[_this.host] = items.q_note_data[_this.host] || []
                    _this.data = items.q_note_data[_this.host]
                    _this.data = _this.data.map((item) => {
                        item.isShow = !item.isHide
                        return item
                    })
                    _this.data = _this.data.reverse()
                })
            },
            modifyNote(item) {
                this.$emit('modifyNote', item)
            },
            switchLike(item) {
                item.isLike = !item.isLike
                !item.isLike && delete item.isLike
                !item.isHide && delete item.isHide
                delete item.isShow
                var _this = this
                chrome.storage.sync.get({
                    q_note_data: {}
                }, function (items) {
                    for (var index in items.q_note_data[_this.host]) {
                        if (items.q_note_data[_this.host][index].id == item.id) {
                            items.q_note_data[_this.host][index] = item
                            break
                        }
                    }
                    chrome.storage.sync.set({
                        q_note_data: items.q_note_data
                    }, function () {
                        _this.refreshData()
                    })
                })
            }
        },
        beforeMount() {
            this.refreshData()
        },
    }
</script>