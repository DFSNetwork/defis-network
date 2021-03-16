<template>
  <div class="setQusAns">
    <div v-for="(v, i) in qus" :key="i">
      <div class="flexa title">
        <span class="flexa">
          <span>{{ v.content }}</span>
          <span v-if="v.type === 'require'" class="red_p">*</span>
        </span>
      </div>
      <div class="textareaDiv">
        <span class="flexa">
          <van-field
            class="textarea"
            v-model="v.ans"
            clearable
            rows="3"
            autosize
            type="textarea"
            :placeholder="$t('bpInfo.bpDescTip')"
          />
        </span>
        <!-- <div class="iptlen">{{ v.getSize(v.ans) }}/256</div> -->
      </div>
    </div>

    <div class="btn flexc" @click="handleSave">{{ $t('bpInfo.save') }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { EosModel } from '@/utils/eos';

export default {
  name: 'setQusAns',
  data() {
    return {
      qusAll: [],
      qus: [],
      ansAll: [],
      desc2: '',
    }
  },
  mounted() {
    this.handleGetQus();
    this.handleGetAns()
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    }),
    lang() {
      if (this.language !== 'en') {
        return 'cn'
      }
      return 'en'
    }
  },
  watch: {
    language() {
      this.handleGetLangQus()
    }
  },
  methods: {
    handleGetSize(str) {
      let total = 0,
          charCode,
          i,
          len;
      for(i = 0, len = str.length; i < len; i++){
          charCode = str.charCodeAt(i);
          if(charCode <= 0x007f) {
              total += 1;
          }else if(charCode <= 0x07ff){
              total += 2;
          }else if(charCode <= 0xffff){
              total += 3;
          }else{
              total += 4;
          }
      }
      return total;
    },
    handleDeal() {
      if (!this.qusAll.length || !this.ansAll.length) {
        return
      }
      this.qusAll.forEach(v => {
        // const ans = this.ansAll.find(vv => vv.qid === v.id && vv.lang === v.lang)
        const ans = this.ansAll.find(vv => vv.qid === v.id)
        if (ans) {
          this.$set(v, 'ans', ans.content)
          this.$set(v, 'aid', ans.id)
        }
      })
    },
    async handleGetAns() {
      const bpname = this.$route.params.bpname;
      const params = {
        "code": "dfscommunity",
        "scope": bpname,
        "table": "answers",
        "json": true,
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      console.log(result)
      this.ansAll = result.rows || [];
      this.handleDeal()
    },
    async handleGetQus() {
      const params = {
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await this.$api.get_table_rows(params)
      if (!status) {
        return
      }
      console.log(result)
      const qusAll = result.rows || [];
      qusAll.forEach(v => {
        const getSize = this.handleGetSize;
        this.$set(v, 'getSize', getSize)
        this.$set(v, 'ans', '')
      });
      this.qusAll = qusAll
      this.handleDeal()
      this.handleGetLangQus()
    },
    handleGetLangQus() {
      let lang = 'en';
      if (this.language !== 'en') {
        lang = 'cn'
      }
      this.qus = this.qusAll.filter(v => v.lang === lang)
    },
    handleReg() {
      let err = false;
      this.qus.forEach(v => {
        if (v.type === 'require' && !v.ans.trim()) {
          this.$message.error('请检查必填回答是否已经填写！')
          err = true
          return 
        }
      })
      if (err) {
        return false
      }
      return true
    },
    handleSave() {
      if (!this.handleReg()) {
        return
      }
      const formName = this.scatter.identity.accounts[0].name;
      const permission = this.scatter.identity.accounts[0].authority;
      const bpname = this.$route.params.bpname;

      const actions = [];
      this.qus.forEach(v => {
        const item = {
          account: 'dfscommunity',
          name: 'seta',
          authorization: [{
            actor: formName, // 转账者
            permission,
          }],
          data: {
            editor: formName,
            producer: bpname,
            aid: v.aid || 100000, // 没有回答过 - 100000 ｜ 回答过 - 回答的那个aid
            qid: v.id,
            lang: this.lang,
            content: v.ans,
          }
        }
        actions.push(item)
      })
      const params = {
        actions
      }
      EosModel.toTransaction(params, (res) => {
        this.loadingJoin = false;
        if(res.code && JSON.stringify(res.code) !== '{}') {
          this.$message({
            message: res.message,
            type: 'error'
          });
          return
        }
        this.$message({
          message: this.$t('public.success'),
          type: 'success'
        });
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.setQusAns{
  margin: 0 28px 28px;
  .title{
    height: 90px;
  }
  .textareaDiv{
    height: auto;
    background: #F5F5F5;
    padding: 18px;
    border-radius: 12px;
  }
  .textarea{
    text-align: left;
    padding: 0;
    border: 0px;
    font-size: 30px;
    background: #F5F5F5;
    /deep/ .van-field__control{
      text-align: left;
      font-size: 32px;
    }
  }
  .iptlen{
    text-align: right;
    font-size: 28px;
    color: #999;
    right: 0px;
    bottom: 5px;
  }
  .btn{
    margin: 30px 0;
    background: #29D4B0;
    color: #FFF;
    font-weight: 500;
    border-radius: 45px;
    height: 90px;
  }
}
</style>
