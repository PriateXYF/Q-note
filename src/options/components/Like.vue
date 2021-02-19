<template>
    <div>
        <!-- <el-collapse accordion>
            <el-collapse-item>
                <template slot="title">
                    一致性 Consistency
                </template>
                <el-row class="allcard">
                    <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in data" :key="index">
                        <el-card class="indexcontainer card" shadow="hover">
                            <div slot="header" class="clearfix">
                                <template>
                                    <el-popconfirm title="确定删除该笔记？">
                                        <span slot="reference" class="card-close-button"><i
                                                class="el-icon-circle-close"></i></span>
                                    </el-popconfirm>
                                </template>

                                <el-tooltip class="item" effect="dark" :content="copyTip" placement="top">
                                    <span class="card-button"><i
                                            :class="item.copyIcon || 'el-icon-copy-document'"></i></span>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="item.isShow ? '隐藏' : '查看'"
                                    placement="top">
                                    <span class="card-button" @click="switchContent(item)"><i
                                            :class="item.isShow ? 'el-icon-remove' : 'el-icon-view'"></i></span>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                                    <span class="card-button" @click="modifyNote(item)"><i
                                            class="el-icon-edit"></i></span>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="item.isLike ? '移出收藏' : '加入收藏'"
                                    placement="top">
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
                        <el-card @click.native="showAddNoteDialog" class="indexcontainer card add-note-card"
                            shadow="hover">
                            <div style="padding: 14px;">
                                <span><i class="el-icon-plus"></i></span>
                                <div class="bottom clearfix"></div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse> -->
    </div>
</template>