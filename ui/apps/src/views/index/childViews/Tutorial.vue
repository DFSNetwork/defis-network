<template>
  <div class="tutorial">
    <div class="list">
      <div class="title">{{ $t('tutorial.title1') }} </div>
      <div class="content">
        <div class="label">{{ $t('tutorial.label1') }}</div>
        <ul class="ul">
          <li>{{ $t('tutorial.ul1_1') }}</li>
          <li>{{ $t('tutorial.ul1_2') }}</li>
          <li>{{ $t('tutorial.ul1_3') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
    <div class="list">
      <div class="title">{{ $t('tutorial.title2') }}</div>
      <div class="content">
        <div class="label">{{ $t('tutorial.label2') }}</div>
        <ul class="ul">
          <li>{{ $t('tutorial.ul2_1') }}</li>
          <li>{{ $t('tutorial.ul2_2') }}</li>
          <li>{{ $t('tutorial.ul2_3') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
    <div class="list">
      <div class="title">{{ $t('tutorial.title3') }}</div>
      <div class="content">
        <div class="label">{{ $t('tutorial.label3') }}</div>
        <ul class="ul">
          <li>{{ $t('tutorial.ul3_1') }}</li>
          <li>{{ $t('tutorial.ul3_2') }}</li>
          <li>{{ $t('tutorial.ul3_3') }}</li>
          <li>{{ $t('tutorial.ul3_4') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
    <div class="list">
      <div class="title">{{ $t('tutorial.title4') }}</div>
      <div class="content">
        <div class="label">{{ $t('tutorial.label4') }}</div>
        <ul class="ul">
          <li>{{ $t('tutorial.ul4_1') }}</li>
          <li>{{ $t('tutorial.ul4_2') }}</li>
          <li>{{ $t('tutorial.ul4_3') }}</li>
          <li>{{ $t('tutorial.ul4_4') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
    <div class="list">
      <div class="title">{{ $t('tutorial.title5') }}</div>
      <div class="content">
        <ul class="ul">
          <li>{{ $t('tutorial.ul5_1') }}</li>
          <li>{{ $t('tutorial.ul5_2') }}</li>
          <li>{{ $t('tutorial.ul5_3') }}</li>
          <li>{{ $t('tutorial.ul5_4') }}</li>
          <li>{{ $t('tutorial.ul5_5') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
    <div class="list">
      <div class="title">{{ $t('tutorial.title6') }}</div>
      <div class="content">
        <ul class="ul">
          <li>{{ $t('tutorial.ul6_1') }}</li>
          <li>{{ $t('tutorial.ul6_2') }}</li>
          <li>{{ $t('tutorial.ul6_3') }}</li>
          <li>{{ $t('tutorial.ul6_4') }}</li>
          <li>{{ $t('tutorial.ul6_5') }}</li>
          <li>{{ $t('tutorial.ul1_4') }}</li>
          <li>{{ $t('tutorial.ul1_5') }}</li>
        </ul>
        <div class="end">{{ $t('tutorial.done') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.tutorial {
  padding: 20px 18px;
  .list {
    text-align: left;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0px;
    }
    .title {
      color: #42b48f;
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 10px;
    }
    .content{
      .label{
        margin-bottom: 10px;
      }
      .ul{
        list-style: disc outside;
        margin-left: 2em;
        color: #070707;
        font-size: 16px;
      }
      .end{
        margin-top: 10px;
        font-size: 14px;
      }
    }
  }
}
</style>
