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
      <card ref="card" :host="host" @modifyNote="modifyNote" @showAddNoteDialog="showAddNoteDialog"></card>
      <add-dialog ref="addDialog" :host="host" @refreshData="refreshData"></add-dialog>
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
  import addDialog from '../components/AddDialog'
  import modifyDialog from '../components/ModifyDialog'
  export default {
    name: 'App',
    components: {
      card,
      addDialog,
      modifyDialog
    },
    data() {
      return {
        host: 'unknown',
      }
    },
    methods: {
      showAddNoteDialog() {
        this.$refs.addDialog.showAddNoteDialog()
      },
      hideAddNoteDialog() {
        this.$refs.addDialog.hideAddNoteDialog()
      },
      refreshData() {
        this.$refs.card.refreshData()
      },
      modifyNote(item) {
        this.$refs.modifyDialog.showModifyNoteDialog(item)
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