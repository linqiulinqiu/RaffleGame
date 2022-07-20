<template>
  <el-col>
    <h4>团队资金</h4>
    <p>
      <span v-for="(key, value) in this.team_pool_list" :key="value">
        {{ key }} {{ value }}
        <el-button @click="teamClaim()">提取</el-button>
        <br />
      </span>
    </p>
  </el-col>
</template>
<script>
import { ethers } from "ethers";
import game from "../../game";
import tokens from "../../tokens";
export default {
  props: ["bsc"],
  data() {
    return {
      addrZero: ethers.constants.AddressZero,
      team_pool_list: { BNB: "", PBP: "" },
      team_loading: false,
    };
  },
  mounted() {
    this.load_teamPool();
  },
  methods: {
    load_teamPool: async function () {
      const ctr = this.bsc.ctrs.holdgame;
      this.team_pool_list["BNB"] = await tokens.format(
        this.addrZero,
        await ctr.teamClaimable(this.addrZero)
      );
      const pbpaddr = this.bsc.ctrs.pbp.address;
      this.team_pool_list["PBP"] = await tokens.format(
        pbpaddr,
        await ctr.teamClaimable(pbpaddr)
      );
      console.log("team pool", this.team_pool_list);
    },
    teamClaim: async function () {
      const ctr = this.bsc.ctrs;
      const res = await ctr.holdgame.teamClaim(ctr.pbp.address);
      console.log("team pool", res);
    },
  },
};
</script>