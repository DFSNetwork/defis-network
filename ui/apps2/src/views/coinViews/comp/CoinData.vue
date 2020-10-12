<template>
  <div>
    <div class="title flexb">
        <span class="act">{{ $t('info.top10') }}</span>
        <!-- <span class="date">{{ nowDate }}</span> -->
        <span class="sort">
          <span>{{ $t('info.sort') }}：</span>
          <span>
            <el-select v-model="sortValue"
              class="select"
              :popper-class="'mySelectItem'"
              :popper-append-to-body="false">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </span>
        </span>
      </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
.title{
  font-size: 32px;
  text-align: left;
  margin: 0 0 40px;
  position: relative;
  &>span{
    margin-right: 60px;;
  }
  .act{
    color: $color-black;
    position: relative;
    &::before{
      content: '';
      position: absolute;
      width:60px;
      height:8px;
      background:rgba(2,198,152,1);
      border-radius:4px;
      bottom: -20px;
      left: 30px;
      // transform: translateX(-45%);
    }
  }
  .date{
    position: absolute;
    right: 0px;
    top: 50%;
    margin-right: 0;
    font-size: 28px;
    color: #a6a6a6;
    transform: translateY(-50%);
  }
  .sort{
    margin-right: 0;
    .select{
      height: 50px;
      border: 1px solid #e3e3e3;
      border-radius: 10px;
    }
    /deep/ .el-select{
      border-radius: 10px;
      .el-input__suffix-inner{
        display: flex;
        align-items: center;
        height: 50px;
      }
      .el-input__inner{
        border-radius: 10px;
        height: 50px;
        font-size: 26px;
        text-align: center;
        width: 130px;
        border: 0px;
        padding-right: 38px;
        &:focus{
          border-color: #07d79b;
        }
      }
    }
    /deep/ .el-scrollbar{
      .el-select-dropdown__item{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 26px;
        font-weight: normal;
        &.selected{
          font-weight: bold;
          color: #07d79b;
        }
      }
    }
  }
}
</style>
