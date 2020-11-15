<template>
  <div>
    <div class="lists">
      <div class="list">
        <div class="flexa">
          <div class="headImg">
            <img width="100%" src="https://cdn.jsdelivr.net/gh/defis-net/material/coin/sab123451111-sab.png" alt="">
          </div>
          <div class="mainDiv">
            <div class="flexb">
              <div class="name">
                <div>testtesttest</div>
                <div class="tip funNum dinReg">捐赠数量: 100.0000 DFS</div>
              </div>
              <div class="likeDiv tip flexend">
                <span>100</span>
                <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike.png" alt="">
                <!-- <img width="20px" src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/newlike1.png" alt=""> -->
              </div>
            </div>
          </div>
        </div>

        <div class="memo">
          <span>
            <span class="reply">回复</span>
            <span class="green">testtesttest</span>
          </span>
          <span>简单来说，我们创建DFS不是为了赚钱；我简单来说，我们创建DFS不是为了赚钱；我</span>
        </div>
        <div class="time tip flexa">
          <span>1分钟前</span>
          <span class="reply">回复</span>
        </div>
      </div>
    </div>
    <div class="showMore flexa" @click="handleGetMore">
      <span>展开更多回复</span>
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
    </div>
    <div class="closeMore flexa" @click="handleGetMore">
      <span>收回</span>
      <img src="https://cdn.jsdelivr.net/gh/defis-net/material/icon/showMore.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'replyLists',
  props: {
    listsLen: { // 总计多少条回复
      type: Number,
      default: 0
    },
    target: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      pageSize: 10,
      page: 1,
      lists: [],
    }
  },
  methods: {
    async handleGetReplyFirst() {
      // 第一次展开 获取前3条 - mounted调用
    },
    // 点击展开更多时调用
    async handleGetMore() {
      // 调用API获取前10条
      if (this.page === 1) { // 第一页时 - 直接覆盖之前数据
        this.lists = []
      } else { // 下一页时，在后面插入
        this.lists.push(...[])
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.green{
  color: #29D4B0 !important;
}
.lists{
  .list{
    padding: 20px 0;
    .headImg{
      width: 52px;
      height: 52px;
      overflow: hidden;
      border-radius: 30px;
      margin-right: 8px;
    }
    .likeDiv{
      font-size: 22px;
      img{
        width: 32px;
        margin-left: 8px;
      }
    }
    .mainDiv{
      flex: 1;
      .funNum{
        margin-top: 4px;
        font-size: 22px;
      }
    }
    .memo{
      margin-top: 4px;
      .reply{
        margin: 0 8px 0 0;
      }
      .green{
        margin-right: 8px;
      }
    }
    .time{
      margin-top: 4px;
      font-size: 20px;
    }
    .reply{
      color: #999;
      font-size: 26px;
      margin-left: 8px;
      font-weight: 500;
    }
  }
}
.showMore{
  color: #29D4B0;
  margin-top: 8px;
  img{
    width: 20px;
    margin-left: 6px;
  }
}
.closeMore{
  color: #29D4B0;
  margin-top: 8px;
  &>span{
    margin-right: 6px;
  }
  img{
    width: 20px;
    transform: rotate(180deg);
  }
}
</style>
