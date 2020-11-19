<template>
  <div class="imgcheck">
    <!-- <img class="close" @click="handleClose(false)" src="https://cdn.jsdelivr.net/gh/defis-net/material/svg/sd_icon_btn.svg" alt=""> -->
    <div class="title">
      <span v-if="showType === 'bg'">选择背景</span>
      <span v-else>选择头像</span>
    </div>
    <div v-if="showType === 'bg'">
      <div class="flexb" v-for="(page, i) in bg" :key="`page${i}`">
        <div class="item" v-for="(item, index) in page" :key="index" @click="checked = item.id">
          <img class="checkedImg" v-if="checked === item.id" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png" alt="">
          <img class="bgImg" :src="item.img">
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="flexb" v-for="(page, i) in head" :key="`page${i}`">
        <div class="item" v-for="(item, index) in page" :key="index">
          <div :class="`imgDiv flexc ${item.bgClass}`" @click="checked = item.id">
            <img class="checkedImg" v-if="checked === item.id" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/checked.png" alt="">
            <div class="bgFFF flexc">
              <img :src="item.img">
            </div>
          </div>
          <span>{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="btn flexc" @click="handleSure">确定</div>
  </div>
</template>

<script>
export default {
  name: 'imgCheck',
  props: {
    showType: {
      type: String,
      default: 'head'
    }
  },
  data() {
    return {
      checked: -1,
      head: [[{
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/tagtokenmain-tag.png',
        bgClass: '',
        name: '秋禾',
        id: 1,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/dbctokenmain-dbc.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/dbctokenmain-dbc.png',
        bgClass: 'imgDivBg2',
        name: '白菜',
        id: 2,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/art/bird0.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/art/bird0.png',
        bgClass: 'imgDivBg3',
        name: '青鸟',
        id: 3,
      }], [{
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/yfctokenmain-yfc.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/yfctokenmain-yfc.png',
        bgClass: 'imgDivBg4',
        name: '锦鲤',
        id: 4,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/art/kun.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/art/kun.png',
        bgClass: 'imgDivBg5',
        name: '鲲',
        id: 5,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/pddtokenmain-pdd.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/coin/pddtokenmain-pdd.png',
        bgClass: 'imgDivBg6',
        name: '金猪',
        id: 6,
      }]],
      bg: [[{
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/smallBanner1.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner1.png',
        bgClass: '',
        name: '青山绿水',
        id: 1,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/smallBanner2.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner2.png',
        bgClass: '',
        name: '秋风芦苇',
        id: 2,
      }], [{
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/smallBanner3.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner3.png',
        bgClass: '',
        name: '浩瀚无限',
        id: 3,
      }, {
        img: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/smallBanner4.png',
        setImg: 'https://cdn.jsdelivr.net/gh/defis-net/material/accBanner/banner4.png',
        bgClass: '',
        name: '嫩脆麦芽',
        id: 4,
      }]]
    }
  },
  methods: {
    handleClose(type) {
      this.$emit('listenClose', type)
    },
    handleSure() {
      if (this.checked === -1) {
        return
      }
      const tLists = this.showType === 'bg' ? this.bg : this.head;
      const lists = []
      tLists.forEach(v => {
        lists.push(...v)
      })
      const checkSrc = lists.find(v => v.id === this.checked)
      this.$emit('listenSure', checkSrc.setImg)
      // this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
.imgcheck{
  padding: 28px;
  font-size: 28px;
  position: relative;
  color: #333;
  .close{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 20px;
  }
  .title{
    font-size: 36px;
    font-weight: 500;
    margin-bottom: 50px;
  }
  .item{
    flex: 1;
    margin-right: 36px;
    text-align: center;
    margin-bottom: 20px;
    position: relative;
    .bgImg{
      width: 300px;
      height: 180px;
    }
    .checkedImg{
      position: absolute;
      top: 16px;
      right: 16px;
      width: 44px;
    }
    .imgDiv{
      width: 186px;
      height: 186px;
      background: #FFFAE0;
      margin-bottom: 10px;
      border-radius: 12px;
      position: relative;
      &.imgDivBg2 {
        background: #EEF5E0;
      }
      &.imgDivBg3 {
        background: #D9F4F4;
      }
      &.imgDivBg4 {
        background: #FFEDE6;
      }
      &.imgDivBg5 {
        background: #EEE6FE;
      }
      &.imgDivBg6 {
        background: #FCEBE2;
      }
      .bgFFF{
        background: #FFF;
        width: 134px;
        height: 134px;
        border-radius: 50%;;
      }
    }
    img{
      width: 80px;
    }
    &:last-child{
      margin-right: 0;
    }
  }
}
.btn{
  margin-top: 50px;
  height: 90px;
  background: #29D4B0;
  border-radius: 45px;
  font-size: 32px;
  font-weight: 500;
  color: #FFF;
}
</style>