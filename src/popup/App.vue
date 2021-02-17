<template>
  <el-container>
    <el-header>
      <el-row class="head-text">
        <p class="head-text-line-1">{{ defaultText }}</p>
        <p class="head-text-line-2">
          <el-tag effect="dark">{{host}}</el-tag>
        </p>
      </el-row>
    </el-header>
    <el-main>
      <div>
        <el-row class="allcard">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" v-for="(item, index) in data" :key="index">
            <el-card class="indexcontainer card">
              <div style="padding: 14px;">
                <span>{{item.content}}</span>
                <div class="bottom clearfix">
                  <div class="desc">{{item.time}}</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <el-card @click.native="showAddNoteDialog" class="indexcontainer card">
              <div style="padding: 14px;">
                <span><i class="el-icon-plus"></i></span>
                <div class="bottom clearfix"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-main>
    <el-footer>
      <el-dialog title="添加笔记" :visible.sync="dialogFormVisible" center>
        <el-form :model="note">
          <el-form-item>
            <el-input type="textarea" v-model="note.content" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="note.isHide">隐藏文本</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNote">确 定</el-button>
        </div>
      </el-dialog>
    </el-footer>
  </el-container>
</template>

<style>
  .el-dialog {
    width: 80% !important;
  }

  .head-text-line-1 {
    padding: 0;
    margin-block-start: 0.5em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  .head-text-line-2 {
    margin-top: 0px;
    padding: 0;
    margin-block-start: 0em;
    margin-block-end: 0em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }

  .head-text {
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 30px;
  }

  .allcard {
    margin: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .indexcontainer {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .card {
    margin-bottom: 10px;
    /* width: 100%; */
    background-size: cover !important;
    font-size: 20px;
  }

  .card:hover {
    cursor: pointer;
  }

  .el-divider__text {
    font-size: 30px;
  }

  .block {
    cursor: not-allowed !important;
  }

  .bottom {
    margin-top: 13px;
    font-size: 16px;
    line-height: 12px;
  }
</style>

<script>
  import dayjs from 'dayjs'
  export default {
    name: 'App',
    data() {
      return {
        host: 'unknown',
        dialogFormVisible: false,
        note: {
          content: "",
          isHide: false
        },
        data: []
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
          isHide: false
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
          _this.data = items.q_note_data.filter((item) => item.host == _this.host)
          chrome.storage.sync.set({
            q_note_setting: {
              number: ++items.q_note_setting.number,
            },
            q_note_data: items.q_note_data
          }, function () {
            _this.hideAddNoteDialog()
          })
        })
      },
      resetData() {
        var _this = this
        chrome.storage.sync.set({
          q_note_setting: {
            number: 0,
          },
          q_note_data: []
        }, function (res) {
          _this.$message.success('重置完毕！');
        })
      }
    },
    mounted() {
      var _this = this
      chrome.browserAction.setBadgeText({
        text: '1'
      })
      chrome.tabs.query({
        active: true
      }, function (tab) {
        _this.host = tab[0].url.toLowerCase().replace("http://", "").replace("https://", "").replace('www.', '')
          .split(
            '/')[0] || 'unknow'
      })
      chrome.storage.sync.get({
        q_note_setting: {
          number: 0,
        },
        q_note_data: []
      }, function (items) {
        _this.data = items.q_note_data.filter((item) => item.host == _this.host)
      })
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