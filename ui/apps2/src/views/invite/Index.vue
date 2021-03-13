<template>
  <div class="invite">
    <AccInfo :accInfo="accInfo" :joinInfo="joinInfo"/>
    <Farms :lists="lists" :joinInfo="joinInfo"/>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AccInfo from "./comp/AccInfo";
import Farms from "./comp/Farms";
export default {
  name: "invite",
  components: {
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
    async handleGetFarms() {
      const params = {
        json: true,
        limit: 1000,
        code: "farms.tag",
        scope: "farms.tag",
        table: "farms",
      };
      const { status, result } = await this.$api.get_table_rows(params);
      if (!status) {
        return;
      }
      const rows = result.rows || [];
      rows.sort((a, b) => {
        return parseFloat(b.wealth ||0) - parseFloat(a.wealth)
      })
      this.lists = rows;
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
        limit: 1000,
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
      this.joinInfo = this.lists.find(v => v.owner === this.joinName)
    }
  },
};
</script>

<style lang="scss" scoped>
// .invite {

// }
</style>
