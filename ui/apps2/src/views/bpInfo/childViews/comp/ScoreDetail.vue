<template>
  <div class="detail">
    <div>
      <div class="star">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
      </div>
      <div class="bar">
        <div class="percent" :style="handleGetPercent(9, 10)"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
      </div>
      <div class="bar">
        <div class="percent" :style="handleGetPercent(7, 8)"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
      </div>
      <div class="bar">
        <div class="percent" :style="handleGetPercent(5, 6)"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
      </div>
      <div class="bar">
        <div class="percent" :style="handleGetPercent(3, 4)"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-black.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
        <img src="https://cdn.jsdelivr.net/gh/defis-net/material/bpInfo/star-un.png" alt="">
      </div>
      <div class="bar">
        <div class="percent" :style="handleGetPercent(1, 2)"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    bpStar: {
      type: Object,
      default: function bs() {
        return {}
      }
    }
  },
  methods: {
    handleGetPercent(lv1,lv2) {
      let n = 0;
      n = Number(this.bpStar[`star${lv1}`] || 0) + Number(this.bpStar[`star${lv2}`] || 0)
      return `width: ${(n / this.bpStar.count_num) * 100}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.detail{
  &>div{
    display: flex;
    align-items: center;
  }
  .star{
    font-size: 14px;
    img{
      width: 14px;
      margin: 5px 4px;
    }
    /deep/ .van-icon{
      margin: 5px 4px;
      color: #959AA5;
    }
    .tip{
      color: #dcdcdc !important;
    }
  }
  .bar{
    margin: 0 12px;
    width: 120px;
    height: 5px;
    border-radius: 4px;
    background: #dcdcdc;
    position: relative;
    .percent{
      height: 5px;
      width: 20%;
      background: #666;
      border-radius: 4px;
    }
  }
}
</style>
