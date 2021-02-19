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

    .el-popconfirm__action .el-button--primary{
        background-color: rgba(173, 123, 124, 0.5);
        border-color: transparent;
    }
    .el-popconfirm__action .el-button--primary:hover{
        background-color: rgba(173, 123, 124, 0.2);
        border-color: transparent;
    }

    .card a {
        text-decoration: none;
        color: #686868;;
        
    }
    .card a:hover{
        text-decoration: underline;
        color: rgb(173, 123, 124);
        opacity: 0.8;
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
        /* color: pink; */
    }

    .allcard {
        margin: 20px;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .el-card__header {
        padding: 0 !important;
        border-bottom: 1px solid #686868 !important;
    }

    .card {
        margin-bottom: 10px;
        /* width: 100%; */
        background-size: cover !important;
        background-color: rgba(255, 255, 255, 0.3) !important;
        border-color: #686868 !important;
        font-size: 20px;
    }
    .card:hover {
        box-shadow: 0 2px 12px 0 rgb(0 0 0) !important;
    }


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
        props: ['host', 'data'],
        data() {
            return {
                copyTip: '复制',
                marked: marked,
            }
        },
        methods: {
            async copyContent(item) {
                try {
                    var text = marked(item.content).replace(/<\/?[^>]*>/g, ' ').replace(/&nbsp;/ig, ' ').trim()
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
                        this.$emit('refreshShow')
                        break
                    }
                }
                // 
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
                        _this.$emit('refreshData')
                    })
                })
            },
            modifyNote(item) {
                this.$emit('modifyNote', item, this.host)
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
                        _this.$emit('refreshData')
                    })
                })
            }
        },
        beforeMount() {
            this.$emit('refreshData')
        },
        mounted() {
            setTimeout(function(){
                document.querySelectorAll('a').forEach((item)=>{
                    item.addEventListener('click', function(e){
                        e.preventDefault()
                        chrome.tabs.create({
                            url: this.href
                        })
                    })
                })
            },0)
        },
        computed:{
         
        }
    }
</script>