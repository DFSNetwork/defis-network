<template>
  <div class="detail">
    <div>
      <div class="star">
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
      </div>
      <div class="bar">
        <div class="percent"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" class="tip"/>
      </div>
      <div class="bar">
        <div class="percent"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
      </div>
      <div class="bar">
        <div class="percent"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <van-icon name="star" />
        <van-icon name="star" />
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
      </div>
      <div class="bar">
        <div class="percent"></div>
      </div>
    </div>
    <div>
      <div class="star">
        <van-icon name="star" />
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
        <van-icon name="star" class="tip"/>
      </div>
      <div class="bar">
        <div class="percent"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  
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
