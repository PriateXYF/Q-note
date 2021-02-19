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
      <card ref="card" :data="data" :host="host" @modifyNote="modifyNote" @refreshData="refreshData"
        @refreshShow="refreshShow"></card>
      <add-card :host="host" @refreshData="refreshData"></add-card>
      <modify-dialog ref="modifyDialog" :host="host" @refreshData="refreshData"></modify-dialog>
    </el-main>
    <el-footer>

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

  .text {
    font-size: 14px;
  }
</style>

<script>
  import card from '../components/Card'
  import addCard from '../components/AddCard'
  import modifyDialog from '../components/ModifyDialog'
  export default {
    name: 'App',
    components: {
      card,
      addCard,
      modifyDialog
    },
    data() {
      return {
        host: 'unknown',
        data: []
      }
    },
    methods: {
      hideAddNoteDialog() {
        this.$refs.addDialog.hideAddNoteDialog()
      },
      modifyNote(item) {
        this.$refs.modifyDialog.showModifyNoteDialog(item)
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
      refreshShow() {
        this.data = Object.assign({}, this.data)
      }
    },
    beforeMount() {
      var _this = this
      chrome.tabs.query({
        active: true
      }, function (tab) {
        tab[0].url = tab[0].url || 'unknow'
        _this.host = tab[0].url.toLowerCase().replace("http://", "").replace("https://", "").replace(
          'www.', '').split('/')[0]
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