<template>
  <div class="deposit">
    <div class="qrCodeDiv" ref="qrCodeUrl"></div>
    <div class="title">充值地址</div>
    <div class="address flexa">{{ address }}</div>
    <div class="btn flexc"
      v-clipboard:copy="address"
      v-clipboard:success="handleCopy"
      v-clipboard:error="handleCopyError">复制地址</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcodejs2'

export default {
  name: 'depositForPtoken',
  props: {
    action: {
      type: Object,
      default: function at() {
        return {}
      }
    }
  },
  data() {
    return {
      res: {},
      address: '',
      qrCode: '',
    }
  },
  computed: {
    ...mapState({
      account: state => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function at() {
        this.handleGetAddress()
      },
      deep: true,
      immediate: true,
    }
  },
  mounted() {
  },
  methods: {
    async handleGetAddress() {
      if (!this.account.name) {
        return
      }
      this.uuid = uuidv4()
      const token = this.action.urlToken.toLowerCase();
      const token1 = this.action.token1.toLowerCase();
      const name = this.account.name;
      const params = {
        token,
        token1,
        "id": this.uuid,
        "jsonrpc": "2.0",
        "method": "app_getNativeDepositAddress",
        "params": [name]
      }
      const {status, result} = await this.$api.ptoken_get_address(params)
      // console.log(result)
      if (!status) {
        return
      }
      this.res = result.result
      this.address = this.res.nativeDepositAddress;
      this.handleQrCode()
    },
    handleQrCode() {
      let size = (280 * 0.5 * (document.documentElement.clientWidth / 375))
      size > 190 ? size = 190 : '';
      this.qrCode = new QRCode(this.$refs.qrCodeUrl, {
        text: this.address,
        width: size,
        height: size,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
      })
    },
    // 分享 - 复制文本
    handleCopy() {
      this.$message.success({
        message: this.$t('public.copySuccess'),
        position: 'center',
        duration: 2000
      });
    },
    handleCopyError() {
      this.$message.error({
        message: this.$t('public.copyFail'),
        position: 'center',
        duration: 2000
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.deposit{
  background: rgba(41, 212, 176, 0.08);
  margin: 36px 32px;
  padding: 42px 24px;
  font-size: 28px;
  color: #333;
  .qrCodeDiv{
    padding: 10px;
    border-radius: 6px;
    width: 300px;
    height: 300px;
    box-sizing: border-box;
    background: #FFF;
    margin: auto;
  }
  .title{
    margin: 26px;
  }
  .address{
    height: 80px;
    padding: 0 26px;
    background: #FFF;
    border-radius: 4px;
  }
  .btn{
    width: 50%;
    margin: 32px auto 0;
    color: #FFF;
    font-size: 32px;
    border-radius: 45px;
    height: 80px;
    background: #29D4B0;
  }
}
</style>