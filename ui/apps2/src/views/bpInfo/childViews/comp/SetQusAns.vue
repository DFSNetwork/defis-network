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
            rows="5"
            autosize
            type="textarea"
            placeholder="请简单描述节点信息"
          />
        </span>
        <div class="iptlen">{{ v.getSize(v.ans) }}/256</div>
      </div>
    </div>

    <div class="btn flexc">保存</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {get_table_rows} from '@/utils/api'

export default {
  name: 'setQusAns',
  data() {
    return {
      qusAll: [],
      qus: [],
      desc2: ''
    }
  },
  mounted() {
    this.handleGetQus();
  },
  computed: {
    ...mapState({
      scatter: state => state.app.scatter,
      language: state => state.app.language,
    }),
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
    async handleGetQus() {
      const params = {
        // dfscommunity bp.dfs editors
        "code":"dfscommunity",
        "scope":"dfscommunity",
        "table":"questions",
        "json":true,
      }
      const {status, result} = await get_table_rows(params)
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
      this.handleGetLangQus()
    },
    handleGetLangQus() {
      let lang = 'en';
      if (this.language !== 'en') {
        lang = 'zh'
      }
      this.qus = this.qusAll.filter(v => v.lang === lang)
    }
  }
}
</script>

<style lang="scss" scoped>
.setQusAns{
  margin: 28px;
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
