<template>
    <div>
        <el-button class="like-data-button" @click="$to('/')">返回首页</el-button>
        <el-button class="like-data-button" @click="refreshData()" type="primary">刷新</el-button>
        <el-collapse accordion>
            <el-collapse-item v-for="(site, index) in all_site" :key="index">
                <template slot="title">
                    <el-tag>{{site}}</el-tag><el-tag class="host-data-number" type="success">{{all_data[site].length}}</el-tag>
                </template>
                <card ref="card" :data="all_data[site]" :host="site" @modifyNote="modifyNote"
                    @showAddNoteDialog="showAddNoteDialog" @refreshData="refreshData" @refreshShow="refreshShow"></card>
            </el-collapse-item>
        </el-collapse>
        <modify-dialog ref="modifyDialog" :host="host" @refreshData="refreshData"></modify-dialog>
    </div>
</template>
<style>
.host-data-number{
    margin-left : 10px;
}

    .like-data-button {
        margin-top: 20px !important;
        margin-bottom: 20px !important;
        margin-right: 10px !important;
    }
</style>
<script>
    import card from '../../components/Card'
    import modifyDialog from '../../components/ModifyDialog'
    export default {
        name: 'App',
        components: {
            card,
            modifyDialog
        },
        data() {
            return {
                host: 'github.com',
                data: [],
                all_site: [],
                all_data: {}
            }
        },
        methods: {
            showAddNoteDialog() {
                this.$refs.addDialog.showAddNoteDialog()
            },
            hideAddNoteDialog() {
                this.$refs.addDialog.hideAddNoteDialog()
            },
            modifyNote(item, host) {
                this.host = host
                this.$refs.modifyDialog.showModifyNoteDialog(item)
            },
            refreshData() {
                var all_site = []
                var all_data = {}
                var _this = this
                chrome.storage.sync.get({
                    q_note_setting: {
                        number: 0,
                    },
                    q_note_data: {}
                }, function (items) {
                    for (var host in items.q_note_data) {
                        var notes = items.q_note_data[host]
                        if (notes.length != 0) {
                            notes = notes.map((note) => {
                                note.isShow = !note.isHide
                                return note
                            })
                            all_data[host] = notes.reverse()
                            all_site.push(host)
                        }
                    }
                    _this.all_site = all_site
                    _this.all_data = all_data
                })
            },
            refreshShow() {}
        },
        beforeMount() {
            this.refreshData()
        },
        created() {
            // 监听快捷键
            let _this = this;
            document.onkeydown = function (e) {
                let evn = e || event;
                let key = evn.keyCode || evn.which || evn.charCode;
                if (evn.metaKey && key == 78) {
                    e.preventDefault()
                    _this.showAddNoteDialog()
                }
            }
        },
        computed: {
            defaultText() {
                return browser.i18n.getMessage('extName')
            },
        }
    }
</script>

<style>
    html {
        width: 400px;
        height: 400px;
    }
</style>