<template>
  <div class="imgDiv" @click.stop="''">
    <div class="flexa rowImg"
      :class="{'row2': rNum === 2, 'row3': rNum === 3}"
      v-for="(rArr, index) in dealImgArr" :key="index">
      <!-- <img class="img hide" v-for="(img, i) in rArr" :key="`${index}_${i}`"
        v-lazy="img"> -->
      <!-- <span class="img" v-for="(img, i) in rArr" :key="`${index}_${i}`">{{ img }}</span> -->
      <div class="img" v-for="(img, i) in rArr" 
        :key="`${index}_${i}`"
        @click="handleShowImg(index, i)"
        v-lazy:background-image="img">
        <img class="img hide" v-lazy="img">
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from 'vant';
export default {
  name: 'funImg',
  props: {
    imgArr: {
      type: Array,
      default: function iarr() {
        return []
      }
    }
  },
  data() {
    return {
      dealImgArr: [],
      rNum: 1,
      imagePreview: '',
    }
  },
  beforeRouteLeave(to,from,next){
    this.imagePreview.close()
    next()
  },
  mounted() {
    
  },
  watch: {
    imgArr: {
      handler: function ia(newVal) {
        const dealImgArr = [];
        const length = newVal.length;
        let rNum = 1; // 每行图片数量
        if (length > 1) {
          rNum = 3;
        }
        if (length === 4 || length === 2) {
          rNum = 2;
        }
        this.rNum = rNum;
        newVal.forEach((v, index) => {
          const r = parseInt(index / rNum);
          if (!dealImgArr[r]) {
            dealImgArr[r] = []
          }
          dealImgArr[r].push(v)
        });
        this.dealImgArr = dealImgArr;
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    handleShowImg(index, i) {
      const nIndex = index * this.rNum + i;
      this.imagePreview = ImagePreview({
        images: this.imgArr,
        startPosition: nIndex,
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.imgDiv{
  width: 100%;
  .rowImg{
    width: 100%;
    &.row3{
      .img{
        height: 150px;
        max-width: 150px;
      }
    }
    &.row2{
      .img{
        height: 200px;
        max-width: 200px;
      }
    }
    .img{
      max-height: 600px;
      max-width: 600px;
      background-repeat: no-repeat;
      background-size: cover;
      border-radius: 8px;
      flex: 1;
      margin: 6px;
      &:first-child{
        margin-left: 0;
      }
      &:last-child{
        margin-right: 0;
      }
      &.hide{
        opacity: 0;
      }
    }
  }

  // .img{
  //   flex: 1;
  //   padding: 14px;
  // }
}
</style>
