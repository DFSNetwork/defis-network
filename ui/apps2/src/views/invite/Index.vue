<template>
  <div class="invite">
    <DfsFarmsInfo :lists="lists"/>
    <AccInfo :accInfo="accInfo" :joinInfo="joinInfo"/>
    <Farms :lists="lists" :joinInfo="joinInfo"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import DfsFarmsInfo from "./comp/DfsFarmsInfo";
import AccInfo from "./comp/AccInfo";
import Farms from "./comp/Farms";
export default {
  name: "invite",
  components: {
    DfsFarmsInfo,
    AccInfo,
    Farms,
  },
  data() {
    return {
      lists: [],
      accInfo: {}, // 用户创建的农场
      joinInfo: {},
      joinName: '',
    };
  },
  mounted() {
    this.handleGetLocal()
    this.handleGetFarms();
  },
  computed: {
    ...mapState({
      account: (state) => state.app.account,
    }),
  },
  watch: {
    account: {
      handler: function at(newVal) {
        if (!newVal.name) {
          return;
        }
        this.handleGetAccInfo();
        this.handleGetJoin()
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleGetLocal() {
      const lists = localStorage.getItem('ALLFARMS')
      this.lists = lists ? JSON.parse(lists) : [];
      this.handleGetAccInfo();
      this.handleDealJoinInfo()
    },
    async handleGetFarms() {
      let more = true;
      let next_key = '';
      let arr = [];
      while(more) {
        const params = {
          json: true,
          limit: 100,
          code: "farms.tag",
          scope: "farms.tag",
          table: "farms",
          lower_bound: next_key,
        };
        const { status, result } = await this.$api.get_table_rows(params);
        if (!status) {
          return;
        }
        const rows = result.rows || [];
        more = result.more;
        next_key = result.next_key;
        arr.push(...rows)
      }
      arr.sort((a, b) => {
        return parseFloat(b.wealth ||0) - parseFloat(a.wealth)
      })
      this.lists = arr;
      localStorage.setItem('ALLFARMS', JSON.stringify(arr))
      this.handleGetAccInfo();
      this.handleDealJoinInfo()
    },
    handleGetAccInfo() {
      if (!this.lists.length || !this.account.name) {
        return;
      }
      const accInfo = this.lists.find((v) => v.owner === this.account.name) || {};
      this.accInfo = accInfo;
    },
    async handleGetJoin() {
      const name = this.account.name
      const params = {
        json: true,
        limit: 100,
        code: "farms.tag",
        scope: "farms.tag",
        table: "relation",
        lower_bound: ` ${name}`,
        upper_bound: ` ${name}`,
        // lower_bound: 'dfsdeveloper',
        // upper_bound: 'dfsdeveloper',
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        this.joinName = '';
        this.joinInfo = {}
        return;
      }
      const rows = result.rows || [];
      if (!rows.length) {
        this.joinName = '';
        this.joinInfo = {}
        return
      }
      this.joinName = rows[0].join_farm;
      this.handleDealJoinInfo()
    },
    handleDealJoinInfo() {
      if (!this.joinName || !this.lists.length) {
        return
      }
      this.joinInfo = this.lists.find(v => v.owner === this.joinName) || {}
      this.$forceUpdate()
    }
  },
};
</script>

<style lang="scss" scoped>
// .invite {

// }
</style>
