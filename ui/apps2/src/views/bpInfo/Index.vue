<template>
  <div class="bpInfo">
    <div class="bpList" v-for="(v, i) in bpLists" :key="i">
      <div class="flexa">
        <img class="bpImg" :src="v.imgUrl || errImg" :onerror="errImg">
        <div class="name">{{ v.name }}</div>
      </div>
      <div class="content">{{ v.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'bpInfo',
  data() {
    return {
      errImg: 'this.src="https://ndi.340wan.com/eos/eosio.token-eos.png"',
      bpLists: [{
        name: 'dfs.bp',
        imgUrl: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png',
        content: '大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX'
      }, {
        name: 'dfs.bp',
        imgUrl: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png',
        content: '大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX'
      }, {
        name: 'dfs.bp',
        imgUrl: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png',
        content: '大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX大丰收节点，为生态贡献XXXXXXXX'
      }],
    }
  },
}
</script>

<style lang="scss" scoped>
.bpInfo{
  background-image: url('https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/banner.png');
  background-repeat: no-repeat;
  background-size: contain;
  min-height: 700px;
  padding-top: 350px;
  font-size: 24px;
  text-align: left;

  .bpList{
    margin: 0 32px 36px;
    background: #FFF;
    border-radius: 12px;
    padding: 26px 34px;
    border: 1px solid #EAEAEA;
    .bpImg{
      width: 64px;
      height: 64px;
      margin-right: 10px;
      border-radius: 50%;
    }
    .name{
      font-size: 28px;
      font-weight: 600;
    }
    .content{
      margin-top: 20px;
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }
}
</style>
